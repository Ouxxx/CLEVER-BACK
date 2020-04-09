const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const uservalidatorSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  phoneCode: { type: String, required: true },
  emailCode: { type: String, required: true }
});

uservalidatorSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Uservalidator', uservalidatorSchema);