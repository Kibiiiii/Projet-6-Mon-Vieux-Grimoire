const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Vérification du token
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token non fourni' });
    }
    
    console.log('Token reçu:', token); // Vérifie le token reçu
    
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Utilisation d'une variable d'environnement pour la clé secrète
    console.log('Token décodé:', decodedToken); // Vérifie le décodage
    
    req.auth = { userId: decodedToken.userId }; // Ajoute l'ID utilisateur à la requête
    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    res.status(401).json({ message: 'Non autorisé' });
  }
};

