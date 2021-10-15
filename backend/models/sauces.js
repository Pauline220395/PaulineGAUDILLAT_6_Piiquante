const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer:{ type: String, required: true },
    description:{ type: String, required: true },
    mainPepper:{ type: String, required: true },
    imageUrl:{ type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: false },
    dislikes: { type: Number, required: false },
    usersLiked: { type: Array, required: false },
    usersDisliked: { type: Array, required: false },
});

module.exports = mongoose.model('Sauce', sauceSchema);

//schéma de données qui contient les champs souhaités pour chaque sauces, indique leur type ainsi que leur caractère (obligatoire ou non).
//utilisation de la méthode Schema mise à disposition par Mongoose. Pas besoin de mettre un champ pour l'Id puisqu'il est automatiquement généré par Mongoose,

//Puis export de ce schéma en tant que modèle Mongoose appelé « Sauce », le rendant par là même disponible pour notre application Express.