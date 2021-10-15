const bcrypt = require('bcrypt'); //utilise un algorithme unidirectionnel pour chiffrer et créer un hash des mots de passe utilisateur
const jwt = require('jsonwebtoken'); //Créer et vérifier les tokens d'authentification //Les tokens d'authentification permettent aux utilisateurs de ne se connecter qu'une seule fois à leur compte. Au moment de se connecter, ils recevront leur token et le renverront automatiquement à chaque requête par la suite. Ceci permettra au back-end de vérifier que la requête est authentifiée.
const User = require('../models/user');

// Export de la fonction pour se signup
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) //Execution de l'algorythme de hashage, "saler" le mdp 10 fois
    .then(hash => {
        const user = new User({
           email: req.body.email,
           password: hash 
        });
        user.save()
        .then(() => res.status(201).json({message:'Utilisateur créé !'}))
        .catch(error => res.status(400).json({message:'Utilisateur déjà créé !'}));
    })
    .catch(error => res.status(500).json({error}));
};

// Export de la fonction pour se login 
exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
    .then(user => {
        if (!user) {
            return res.status(401).json({error:'Utilisateur non trouvé !'});
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if(!valid) {
                return res.status(401).json({error:'Mot de passe incorrect !'});
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    {userId: user._id},
                    'RANDOM_TOKEN_SECRET', //chaîne secrète de développement temporaire RANDOM_SECRET_KEY pour encoder notre token
                    {expiresIn: '24h'}
                )
            });
        })
        .catch(error => res.status(500).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};