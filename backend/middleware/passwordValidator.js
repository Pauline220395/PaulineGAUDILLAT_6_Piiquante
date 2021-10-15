//importation de password-validator
const passwordSchema = require('../models/password');
const { schema } = require('../models/user');

//Vérification de la qualité du password par rapport au schéma
module.exports = (req, res, next) => {
    if(passwordSchema.validate(req.body.password)){
        next();
    }else{
        //return res.status(400).json({error : `Le mot de passe n'est pas assez fort ${passwordSchema.validate('req.body.password', { list: true})} `})
        return res.status(400).json({message: 'Mot de passe requis : 8 caractères minimun. Au moins 1 Majuscule, 1 minuscule, 2 chiffres. Sans espaces'});
    }
}