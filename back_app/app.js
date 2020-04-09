const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.json());

const userRoutes = require('./routes/user');
const testRoutes = require('./routes/test');
const tokenAuth = require('./middleware/auth-token');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

mongoose.connect('mongodb+srv://AdminApp:IQ5ygsXRUlm0a3mn@clusterv1-lkpz1.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
  console.log('----------------------------------------------------------');
  console.log('Requête reçue !');
  next();
});

app.use('/api/user', userRoutes);
app.use('/api/test', tokenAuth, testRoutes);

app.use((req, res, next) => {
  console.log('----------------------------------------------------------');
});


module.exports = app;