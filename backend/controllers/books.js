const Book = require('../models/Book');
const fs = require('fs');


exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  book.save()
  .then(() => { res.status(201).json({message: 'Livre publié !'})})
  .catch(error => { res.status(400).json( { error })})
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({
    _id: req.params.id
  }).then(
    (book) => {
      res.status(200).json(book);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file ? {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete bookObject._userId;
  Book.findOne({_id: req.params.id})
      .then((book) => {
          if (book.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } else {
              Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Livre modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id})
      .then(book => {
          if (book.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = book.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Book.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Livre supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

exports.getAllBooks = (req, res, next) => {
  Book.find().then(
    (books) => {
      res.status(200).json(books);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};


exports.getBestBooks = (req, res) => {
  Book.find()
  //trier les résultats en fonction de "averageRating" dans l'ordre décroissanté//
    .sort({ averageRating: -1 }) 
  //limiter les résultats à 3 livres//
    .limit(3)
    .then((books) => {
      res.send(books)
    })
    .catch((error) => {
      res.status(400).send("Une erreur est survenue" + error.message);
    });
};

exports.postRating = (req, res) => {
  const id = req.params.id;

  Book.findById(id).then(book => {
    if (book == null) {
      res.status(404).send("Livre non trouvé");
      return;
    }
    const rating = req.body.rating;
    const userId = req.auth.userId;
    const ratingsInDb = book.ratings;
    
    //On vérifie sur l'utilisateur a déjà noté le livre en cherchant dans le rating l'userId qui correspond à celui du token//
    const previousRatingFromCurrentUser = ratingsInDb.find((rating) => rating.userId == userId);
    if (previousRatingFromCurrentUser != null) {
        res.status(400).send("Vous avez déjà noté ce livre")
        return;
    }
    const newRating = {
      userId: userId,
      grade: rating,
    };

    ratingsInDb.push(newRating);
    book.averageRating = calculateAverageRating(ratingsInDb);
      book.save().then(() => {
        
        res.status(200).json(book)
      })
      .catch(
        (error) => {
          res.status(400).json({
            error: error
          });
        }
      );
    })
  }

function calculateAverageRating (ratings) {
  const length = ratings.length;
  const sumOfAllGrades = ratings.reduce((sum, rating) => sum + rating.grade, 0);
  const averageRating = sumOfAllGrades / length;
  return averageRating;
  }
