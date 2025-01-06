const Thing = require('../models/Thing');

// Créer un nouvel objet
exports.createThing = (req, res, next) => {
    const thing = new Thing({
        ...req.body
    });
    thing.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch((error) => {
            console.error('Erreur lors de la création de l\'objet :', error);
            res.status(400).json({ error });
        });
};

// Modifier un objet existant
exports.modifyThing = (req, res, next) => {
    Thing.updateOne(
        { _id: req.params.id }, // Trouver l'objet par ID
        { ...req.body, _id: req.params.id } // Mettre à jour les champs
    )
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch((error) => {
            console.error('Erreur lors de la modification de l\'objet :', error);
            res.status(400).json({ error });
        });
};

// Supprimer un objet
exports.deleteThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
        .then((thing) => {
            if (!thing) {
                return res.status(404).json({ message: 'Objet non trouvé' });
            }
            return Thing.deleteOne({ _id: req.params.id });
        })
        .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
        .catch((error) => {
            console.error('Erreur lors de la suppression de l\'objet :', error);
            res.status(400).json({ error });
        });
};

// Récupérer un objet par son ID
exports.getOneThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
        .then((thing) => {
            if (!thing) {
                return res.status(404).json({ message: 'Objet non trouvé' });
            }
            res.status(200).json(thing);
        })
        .catch((error) => {
            console.error('Erreur lors de la récupération de l\'objet :', error);
            res.status(400).json({ error });
        });
};

// Récupérer tous les objets
exports.getAllStuff = (req, res, next) => {
    Thing.find()
        .then((things) => res.status(200).json(things))
        .catch((error) => {
            console.error('Erreur lors de la récupération des objets :', error);
            res.status(400).json({ error });
        });
};
