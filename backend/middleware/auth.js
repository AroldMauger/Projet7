const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
   try {

    // Récupération du token d'authentification depuis l'en-tête de la requête //
       const token = req.headers.authorization.split(' ')[1];

    // Vérification du token avec la clé secrète JWT_SECRET DU FICHIER .ENV //
       const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Extraction de l'identifiant de l'utilisateur à partir du token décodé //
       const userId = decodedToken.userId;

    // Ajout de l'identifiant de l'utilisateur à l'objet req pour pouvoir l'utiliser dans les routes //
       req.auth = { userId: userId };

    // Passer au middleware suivant //
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};