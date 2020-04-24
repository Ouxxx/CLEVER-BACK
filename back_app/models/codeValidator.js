const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const codeValidatorSchema = mongoose.Schema({
    verificationType :{ type: String, required: true},
    identifier: { type: String, required: true, unique: true},
    code : { type: String, required: true},
    checked : {type: String, required: true }
});

codeValidatorSchema.plugin(uniqueValidator);

module.exports = mongoose.model('CodeValidator', codeValidatorSchema);