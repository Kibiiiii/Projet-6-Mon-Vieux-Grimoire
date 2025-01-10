const Books = require('../models/Books');
const fs = require('fs');

// Récupérer tous les livres
exports.getAllBooks = (req, res, next) => {
    Books.find()
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(400).json({ error }));
};

// Créer un livre
exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    console.log('Objet book reçu:', bookObject);

    delete bookObject._id;

    if (!bookObject.title || !bookObject.author || !bookObject.year || !bookObject.genre) {
        return res.status(400).json({ error: 'Tous les champs requis doivent être remplis.' });
    }

    if (isNaN(bookObject.year)) {
        return res.status(400).json({ error: 'L\'année de publication doit être un nombre.' });
    }

    const book = new Books({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null
    });

    book.save()
        .then(() => res.status(201).json({ message: 'Livre enregistré !', book }))
        .catch((error) => res.status(400).json({ error: error.message }));
};

// Modifier un livre
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

            if (book.userId !== req.auth.userId) {
                return res.status(401).json({ message: 'Non autorisé' });
            }

            Books.updateOne(
                { _id: req.params.id },
                { ...bookObject, _id: req.params.id }
            )
                .then(() => res.status(200).json({ message: 'Livre modifié !' }))
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(400).json({ error }));
};

// Supprimer un livre
exports.deleteBook = (req, res, next) => {
    Books.findOne({ _id: req.params.id })
        .then((book) => {
            if (!book) {
                return res.status(404).json({ message: 'Livre non trouvé' });
            }

            if (book.userId !== req.auth.userId) {
                return res.status(401).json({ message: 'Non autorisé' });
            }

            const filename = book.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Erreur lors de la suppression de l\'image' });
                }

                Books.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
                    .catch((error) => res.status(400).json({ error }));
            });
        })
        .catch((error) => res.status(500).json({ error }));
};

// Récupérer un seul livre
exports.getOneBook = (req, res, next) => {
    Books.findOne({ _id: req.params.id })
        .then((book) => {
            if (!book) {
                return res.status(404).json({ message: 'Livre non trouvé' });
            }
            res.status(200).json(book);
        })
        .catch((error) => res.status(400).json({ error }));
};

// Ajouter une note à un livre
exports.rateBook = async (req, res) => {
    try {
        const { userId, rating } = req.body;
        console.log('Données reçues:', { userId, rating });

        if (!userId || rating === undefined) {
            return res.status(400).json({ error: 'User ID et note requis.' });
        }
        if (rating < 0 || rating > 5) {
            return res.status(400).json({ error: 'La note doit être comprise entre 0 et 5.' });
        }

        const book = await Books.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Livre non trouvé.' });
        }
        console.log('Livre trouvé:', book);

        const alreadyRated = book.ratings.find((r) => r.userId === userId);
        if (alreadyRated) {
            return res.status(400).json({ error: 'Vous avez déjà noté ce livre.' });
        }

        book.ratings.push({ userId, grade: rating });
        const totalRatings = book.ratings.length;
        const sumRatings = book.ratings.reduce((sum, r) => sum + r.grade, 0);
        book.averageRating = sumRatings / totalRatings;

        await book.save();
        console.log('Livre mis à jour avec succès:', book);
        res.status(200).json(book);
    } catch (error) {
        console.error('Erreur lors de la notation du livre:', error);
        res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
};
