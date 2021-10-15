const express = require('express');
const mongoose = require('mongoose'); //Mongoose est un package qui facilite les interactions avec notre base de données MongoDB.
const path = require('path');
const helmet = require('helmet');

const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

mongoose.connect('',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  const app = express(); //créer une application express
  app.use(helmet());

app.use((req, res, next) => { //Ces headers permettent d'accéder à notre API depuis n'importe quelle origine ('*'), d'ajouter les headers mentionnés aux requêtes envoyées vers notre API, d'envoyer des requêtes avec les méthodes mentionnées.
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next(); //la méthode next permet à chaque middleware de passer l'exécution au middleware suivant.
  });

app.use(express.json());

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
