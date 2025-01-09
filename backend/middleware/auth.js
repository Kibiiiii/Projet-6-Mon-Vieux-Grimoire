const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new Error('Authorization header is missing');
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new Error('Authorization header is malformed');
    }

    const token = authHeader.split(' ')[1];
    console.log('Token reçu:', token);

    const decodedToken = jwt.verify(token, 'votre_clé_secrète');
    console.log('Token décodé:', decodedToken);

    req.auth = { userId: decodedToken.userId };
    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error.message);
    res.status(401).json({ message: 'Non autorisé' });
  }
};

