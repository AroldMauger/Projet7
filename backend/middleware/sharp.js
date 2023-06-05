const sharp = require('sharp');
const fs = require('fs');

// --- Redimensionner les images  --- //
module.exports = (req, res, next) => {

  // Vérifier si un fichier image a été téléchargé //
  if (!req.file) {
    console.log("Pas d'image !");
    return next();
  }
  // Obtenir les métadonnées de l'image //
  sharp(req.file.path)
    .metadata()
    .then((metadata) => {
  // Si la largeur de l'image dépasse 500 pixels, alors redimensionner //
      if (metadata.width > 500) {
        return sharp(req.file.path).resize({ width: 500 }).toBuffer();
      } 
  // Ne pas redimensionner l'image //
      else {
        return sharp(req.file.path).toBuffer();
      }
    })
    .then((data) => {

  // Écrire les données de l'image redimensionnée dans le fichier d'origine //
      fs.writeFile(req.file.path, data, (err) => {
        if (err) {
          console.log(err);
          next(err);
        }
  // Passer au middleware suivant //
        next();
      });
    })
    .catch((err) => {
      next(err);
    });
};
