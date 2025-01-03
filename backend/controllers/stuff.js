const Thing = require('../models/thing');

exports.createThing = (req, res, next) => {
    delete req.body._id;
    const thing = new Thing({
        ...req.body
    });
    thing.save()
    .then(() => res.status(201).json({message: 'Livre enregistre !'}))
    .catch((error) => {res.status(400).json({error: error})});
};

exports.modifyThing = (req, res, next) => {
    Thing.updateOne({_id: req.params.id}, thing)
    .then(() => {res.status(201).json({message: 'Livre modifie !'})})
    .catch((error) => {res.status(400).json({error: error})});
};

exports.deleteThing = (req, res, next) => {
    Thing.deleteOne({_id: req.params.id})
    .then(() => {res.status(200).json({message: 'Livre supprime !'})})
    .catch((error) => {res.status(400).json({error: error})});
};

exports.getOneThing = (req, res, next) => {
    Thing.findOne({_id: req.params.id})
    .then((thing) => {res.status(200).json(thing)})
    .catch((error) => {res.status(404).json({error: error})});
};

exports.getAllStuff = (req, res, next) => {
    Thing.find()
    .then((things) => {res.status(200).json(things)})
    .catch((error) => {res.status(400).json({error: error})});
};