const express = require("express");
const mongoose = require("mongoose");
const Thing = require("./models/Thing");

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(error => console.log("Connexion à MongoDB échouée :", error));

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    next();
});

app.use(express.json());

app.use('/api/stuff', stuffRoutes)

module.exports = app;
