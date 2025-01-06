const Thing = require('../models/Thing');

exports.createThing = (req, res, next) => {
    const thing = new Thing({
        ...req.body
    });
    thing.save()
        .then(() => res.status(201).json({ message: 'Livre enregistré !' }))
        .catch((error) => {
            console.error('Erreur lors de la création du livre :', error);
            res.status(400).json({ error });
        });
};

exports.modifyThing = (req, res, next) => {
    Thing.updateOne(
        { _id: req.params.id },
        { ...req.body, _id: req.params.id }
    )
        .then(() => res.status(200).json({ message: 'Livre modifié !' }))
        .catch((error) => {
            console.error('Erreur lors de la modification du livre :', error);
            res.status(400).json({ error });
        });
};

exports.deleteThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
        .then((thing) => {
            if (!thing) {
                return res.status(404).json({ message: 'Livre non trouvé' });
            }
            return Thing.deleteOne({ _id: req.params.id });
        })
        .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
        .catch((error) => {
            console.error('Erreur lors de la suppression du livre :', error);
            res.status(400).json({ error });
        });
};

exports.getOneThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
        .then((thing) => {
            if (!thing) {
                return res.status(404).json({ message: 'Livre non trouvé' });
            }
            res.status(200).json(thing);
        })
        .catch((error) => {
            console.error('Erreur lors de la récupération du livre :', error);
            res.status(400).json({ error });
        });
};

exports.getAllStuff = (req, res, next) => {
    Thing.find()
        .then((things) => res.status(200).json(things))
        .catch((error) => {
            console.error('Erreur lors de la récupération du livre :', error);
            res.status(400).json({ error });
        });
};
