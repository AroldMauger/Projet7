const express = require('express');
require("dotenv").config();
const cors = require("cors");
const bodyParser = require ('body-parser');
const mongoose = require('mongoose');

const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/user');
const path = require('path');

const app = express();



mongoose.connect(`mongodb+srv://${process.env.USER_MONGO}:${process.env.PASSWORD_MONGO}@${process.env.DOMAIN_MONGO}`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


  app.use(cors());

  app.use(bodyParser.json());
  app.use(express.json())

//CORS//
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


  app.use("/api/books", bookRoutes);
  app.use("/api/auth", userRoutes);
  app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;


