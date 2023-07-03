const express = require('express');
const router = express.Router();

const bookCtrl = require('../controllers/books');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sharp = require('../middleware/sharp')

// Créer un livre //
router.post("/", auth, multer, sharp, bookCtrl.createBook); 

// Récupérer tous les livres//
router.get("/", bookCtrl.getAllBooks);

// Récupérer les 3 meilleurs livres //
router.get("/bestrating", bookCtrl.getBestBooks); 

// Supprimer un livre à partir de son ID //
router.delete('/:id', auth, bookCtrl.deleteBook); 

// Récupérer un livre à partir de son ID //
router.get('/:id', bookCtrl.getOneBook); 

// Modifier un livre à partir de son ID //
router.put('/:id', auth, multer, sharp, bookCtrl.modifyBook);

// Mettre une note à un livre à partir de son ID //
router.post("/:id/rating", auth, bookCtrl.postRating); 


module.exports = router;

