const multer = require('multer');

// Formats des images acceptés et leurs extensions //
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Stockage des fichiers avec multer //
const storage = multer.diskStorage({
  destination: (req, file, callback) => {

// Dossier de destination des fichiers //
    callback(null, 'images');
  },

  filename: (req, file, callback) => {
  
    // Création d'un nom de fichier unique
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');