const Book = require('../models/Book');
const fs = require('fs'); // module de NodeJs pour modifier/supprimer des fichiers et des dossiers//

// --- CRÉATION D'UN LIVRE --- //
exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);   // Conversion de la chaîne de caractères JSON en objet JavaScript //
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({      // Création d'une instance du modèle Book avec les données fournies //
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  book.save()    // Sauvegarde du livre dans la base de données //
  .then(() => { res.status(201).json({message: 'Livre publié !'})})
  .catch(error => { res.status(400).json( { error })})
};

// --- RÉCUPÉRER UN LIVRE A PARTIR DE L'ID--- //
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

// --- MODIFIER UN LIVRE A PARTIR DE L'ID--- //
exports.modifyBook = (req, res, next) => {
  const bookObject = req.file ? {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete bookObject._userId;

// Vérification si le livre appartient à l'utilisateur authentifié //
  Book.findOne({_id: req.params.id})
      .then((book) => {
          if (book.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } 
// Mise à jour du livre avec les nouvelles données //
          else {
              Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Livre modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

// --- SUPPRIMER UN LIVRE A PARTIR DE L'ID--- //
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id})
      .then(book => {
          if (book.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = book.imageUrl.split('/images/')[1];

              fs.unlink(`images/${filename}`, () => {     // Suppression du fichier image associé au livre //
                  Book.deleteOne({_id: req.params.id})   // Suppression du livre de la base de données //

                      .then(() => { res.status(200).json({message: 'Livre supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

// --- RÉCUPÉRER TOUS LES LIVRES --- //
exports.getAllBooks = (req, res) => {
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

// --- RÉCUPÉRER LES 3 MEILLEURS LIVRES --- //
exports.getBestBooks = (req, res) => {
  Book.find()
    .sort({ averageRating: -1 })  //trier les résultats en fonction de "averageRating" dans l'ordre décroissanté//
    .limit(3)                     //limiter les résultats à 3 livres//
    .then((books) => {
      res.send(books)
    })
    .catch((error) => {
      res.status(400).send("Une erreur est survenue" + error.message);
    });
};

// --- METTRE UNE NOTE A UN LIVRE --- //
exports.postRating = (req, res) => {
  const id = req.params.id;

  Book.findById(id).then(book => { 
    if (book == null) {       // Si le livre n'existe pas //
      res.status(404).send("Livre non trouvé");
      return;
    }
    const rating = req.body.rating;
    const userId = req.auth.userId;
    const ratingsInDb = book.ratings;
    
    //On vérifie sur l'utilisateur a déjà noté le livre en cherchant dans le rating l'userId qui correspond à celui du token//
    const previousRatingFromCurrentUser = ratingsInDb.find((rating) => rating.userId == userId);
    if (previousRatingFromCurrentUser != null) {
        res.status(400).send("Vous avez déjà noté ce livre")    // Si déjà noté, erreur //
        return;
    }
    const newRating = {
      userId: userId,
      grade: rating,
    };
    // Ajout de la nouvelle note  //
    ratingsInDb.push(newRating);

    // Calcul de la nouvelle moyenne des notes //
    book.averageRating = calculateAverageRating(ratingsInDb);

    // Sauvegarde du livre avec nouvelle note et moyenne //
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
  
// Calcul de la moyenne des notes //
function calculateAverageRating (ratings) {
  const length = ratings.length;
  const sumOfAllGrades = ratings.reduce((sum, rating) => sum + rating.grade, 0);
  const averageRating = sumOfAllGrades / length;
  return averageRating;
  }