const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.post('/form', userCtrl.saveForm);
router.post('/signup', userCtrl.signup);
router.post('/signin', userCtrl.signin);


router.post('/search/email', userCtrl.findUserByEmail);

module.exports = router;