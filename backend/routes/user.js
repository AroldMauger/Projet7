const express = require('express');
const router = express.Router();

// On importe le module user.js //
const userCtrl = require('../controllers/user');

// Créer un compte utilisateur //
router.post("/signup", userCtrl.signup);

// Route pour la connexion d'un utilisateur //
router.post("/login", userCtrl.login);

module.exports = router;