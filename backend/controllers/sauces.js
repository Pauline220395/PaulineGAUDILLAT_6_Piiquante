//Logique Métier 
//Routes CRUD
const Sauce = require('../models/sauces');
const fs = require('fs')

// Export de la fonction pour récupérer toutes les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
};

// Export de la fonction pour récupérer une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
}; 

// Export de la fonction pour créer une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({ //mot-clé new avec un modèle Mongoose crée par défaut un champ_id. Utiliser ce mot-clé générerait une erreur, car nous tenterions de modifier un champ immuable dans un document de la base de données. Par conséquent, nous devons utiliser le paramètre id de la requête pour configurer notre Sauce avec le même_id qu'avant.
        ...sauceObject, //L'opérateur spread (...) va copier tous les éléments de req.body.sauce
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [' '],
        usersdisLiked: [' '],
    });
    
    sauce.save() //Enregistre dans la base de données
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => { console.log(error); res.status(400).json({ message: error }) });
    
};

// Export de la fonction pour modifier une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {         
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
    Sauce.updateOne({ _id: req.params.id}, {...sauceObject, _id: req.params.id})
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

// Export de la fonction pour supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/') [1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
            .catch(error => res.status(400).json({ error }));      
        });
    })
    .catch(error => res.status(500).json({ error }));
};

// Export de la fonction pour gérer likes et dislikes d'une sauce
exports.likeSauce = (req, res, next) => {
    
    const userLike = req.body.like;
    const userId = req.body.userId;
    const sauceId = req.params.id;
    
    //Like
    if (userLike === 1) {
        Sauce.updateOne({_id:sauceId}, { 
            $inc:{likes: +1}, 
            $push: {usersLiked: userId} 
        }) //$inc - $push = operators MongoDB //opérateur $inc incrémente un champ d'une valeur spécifiée //opérateur $push ajoute une valeur spécifiée à un tableau. 
        .then(() => res.status(200).json({message:'Ajout Like'}))
        .catch(error => res.status(400).json({error}));
        
        //Dislike        
    } else if (userLike === -1) {
        Sauce.updateOne({_id:sauceId}, {
            $inc:{dislikes: +1}, 
            $push: {usersDisliked: userId}
        })
        .then(() => res.status(200).json({message:'Ajout Dislike'}))
        .catch(error => res.status(400).json({ error }));
        
        //Supprimer Like
    } else {
        Sauce.findOne({_id:sauceId})
        .then(sauce => {
            if (sauce.usersLiked.includes(userId)) { //vérifie si le tableau contient l'userId
                Sauce.updateOne({_id:sauceId}, {
                    $pull: {usersLiked: userId}, 
                    $inc: {likes: -1}
                }) // opérateur $pull supprime d'un tableau existant toutes les instances d'une valeur ou des valeurs qui correspondent à une condition spécifiée.
                .then(() => { res.status(200).json({message:'Suppression Like'})})
                .catch(error => res.status(400).json({ error }));
                
                //Supprimer Dislike
            } else if (sauce.usersDisliked.includes(userId)) {
                Sauce.updateOne({_id: sauceId}, {
                    $pull: {usersDisliked: userId}, 
                    $inc: {dislikes: -1} 
                })
                .then(() => { res.status(200).json({message:'Suppression Dislike'})})
                .catch(error => res.status(400).json({error}))
            };
        })
        .catch(error => res.status(400).json({error}));
    };
};