const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    email: { type: String, require: true, unique: true}, 
    password: { type: String, require: true}
});

userSchema.plugin(uniqueValidator); //assure que deux utilisateurs ne peuvent pas utiliser la même adresse e-mail

module.exports = mongoose.model('User', userSchema);