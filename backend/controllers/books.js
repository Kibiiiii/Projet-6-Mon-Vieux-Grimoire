const Books = require('../models/Books');

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id; 

    const book = new Books({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null
    });

    book.save()
        .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
        .catch((error) => {
            console.error('Erreur lors de la création du livre :', error);
            res.status(400).json({ error });
        });
};


exports.modifyBook = (req, res, next) => {

    const bookObject = req.file
        ? {
            ...JSON.parse(req.body.book),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        }
        : { ...req.body };

    delete bookObject._userId;

    Books.findOne({ _id: req.params.id })
        .then((book) => {
            if (!book) {
                return res.status(404).json({ message: 'Livre non trouvé' });
            }

            if (book.userId != req.auth.userId) {
                return res.status(401).json({ message: 'Non autorisé' });
            }

            Books.updateOne(
                { _id: req.params.id },
                { ...bookObject, _id: req.params.id }
            )
                .then(() => res.status(200).json({ message: 'Livre modifié !' }))
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => {
            console.error('Erreur lors de la recherche du livre :', error);
            res.status(400).json({ error });
        });
};

const fs = require("fs");

exports.deleteBook = (req, res, next) => {
    Books.findOne({ _id: req.params.id })
        .then((book) => {
            if (!book) {
                return res.status(404).json({ message: "Livre non trouvé" });
            }

            if (book.userId != req.auth.userId) {
                return res.status(401).json({ message: "Non autorisé" });
            }

            const filename = book.imageUrl.split("/images/")[1];

            fs.unlink(`images/${filename}`, (err) => {
                if (err) {
                    console.error("Erreur lors de la suppression de l'image :", err);
                    return res.status(500).json({ error: "Erreur lors de la suppression de l'image" });
                }

                Books.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Livre supprimé !" }))
                    .catch((error) => {
                        console.error("Erreur lors de la suppression du livre :", error);
                        res.status(400).json({ error });
                    });
            });
        })
        .catch((error) => {
            console.error("Erreur lors de la recherche du livre :", error);
            res.status(500).json({ error });
        });
};


exports.getOneBook = (req, res, next) => {
    Books.findOne({ _id: req.params.id })
        .then((book) => {
            if (!book) {
                return res.status(404).json({ message: 'Livre non trouvé' });
            }
            res.status(200).json(book);
        })
        .catch((error) => {
            console.error('Erreur lors de la récupération du livre :', error);
            res.status(400).json({ error });
        });
};

exports.getAllBooks = (req, res, next) => {
    Books.find()
        .then((books) => res.status(200).json(books))
        .catch((error) => {
            console.error('Erreur lors de la récupération du livre :', error);
            res.status(400).json({ error });
        });
};

