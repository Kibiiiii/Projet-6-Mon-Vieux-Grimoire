const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

// Inscription
exports.signup = (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            return user.save();
        })
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => {
            console.error('Erreur lors de l inscription :', error);
            res.status(400).json({ error });
        });
};

exports.login = (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Identifiants invalides' });
            }

            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Identifiants invalides' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.JWT_SECRET || 'default_secret',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => {
                    console.error('Erreur lors de la comparaison des mots de passe :', error);
                    res.status(500).json({ error });
                });
        })
        .catch(error => {
            console.error('Erreur lors de la recherche de l utilisateur :', error);
            res.status(500).json({ error });
        });
};
