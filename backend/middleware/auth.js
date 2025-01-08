const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // récupère le token
    console.log('Token reçu:', token); // Ajoute ce log pour vérifier le token reçu
    
    const decodedToken = jwt.verify(token, 'votre_clé_secrète'); // vérifie le token
    console.log('Token décodé:', decodedToken); // Vérifie si le décodage est réussi

    req.auth = { userId: decodedToken.userId }; // met l'ID utilisateur dans la requête
    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error); // Ajoute ce log pour voir les erreurs
    res.status(401).json({ message: 'Non autorisé' });
  }
};

