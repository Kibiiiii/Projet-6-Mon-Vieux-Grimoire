const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const booksRoutes = require("./routes/books");
const userRoutes = require("./routes/user");

dotenv.config();

if (!process.env.MONGODB_URI) {
    console.error("Erreur : La variable MONGODB_URI n'est pas définie dans le fichier .env");
    process.exit(1);
}

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch((error) => {
        console.error("Connexion à MongoDB échouée :", error);
        process.exit(1);
    });

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.use("/api/books", booksRoutes);
app.use("/api/auth", userRoutes); 

module.exports = app;



