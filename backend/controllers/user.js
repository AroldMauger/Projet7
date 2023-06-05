const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Fonction pour créer un compte utilisateur //
exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      // Crée un nouvel utilisateur avec l'email et le mot de passe haché //
      const user = new User({
        email: req.body.email,
        password: hash
      });
      // Enregistre l'utilisateur dans la base de données //
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// Fonction de connexion des utilisateurs //
exports.login = (req, res, next) => {
  // Recherche de l'utilisateur correspondant à l'email fourni //
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        // Si l'utilisateur n'est pas trouvé, renvoie une erreur d'authentification //
        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
      }
      // Compare le mot de passe fourni avec le mot de passe haché de l'utilisateur //
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            // Si le mot de passe est incorrect, renvoie une erreur d'authentification //
            return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
          }
          // Si l'authentification est réussie, renvoie une réponse avec un token valide //
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              process.env.JWT_SECRET,
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
