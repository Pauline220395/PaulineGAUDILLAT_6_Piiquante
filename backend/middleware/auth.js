const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; //extraire le token du header Authorization de la requête entrante. Fonction split pour récupérer tout après l'espace dans le header.
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); //fonction verify pour décoder notre token. Si celui-ci n'est pas valide, une erreur sera générée
    const userId = decodedToken.userId; //extraire l'ID utilisateur du token
    if (req.body.userId && req.body.userId !== userId) { //si demande contient un ID utilisateur, nous le comparons à celui extrait du token. S'ils sont différents, nous générons une erreur.
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};