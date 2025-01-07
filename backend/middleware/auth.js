const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // Vérification de la présence de l'en-tête Authorization et de son format
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token manquant ou mal formé' });
        }

        const token = req.headers.authorization.split(' ')[1];  // Extraction du token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);  // Vérification du token avec le secret

        const userId = decodedToken.userId;  // Extraction de l'ID utilisateur depuis le token
        req.auth = { userId: userId };  // Attacher l'ID utilisateur à la requête

        next();  // Passage au middleware suivant
    } catch (error) {
        console.error('Erreur lors de la vérification du token :', error);  // Affichage des erreurs côté serveur
        res.status(401).json({ error: 'Authentification échouée' });  // Réponse d'erreur générique
    }
};
