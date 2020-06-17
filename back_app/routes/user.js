const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.post('/form', userCtrl.saveForm);
router.post('/signup', userCtrl.signup);
router.post('/signin', userCtrl.signin);

router.post('/search/email/find', userCtrl.findUserByEmail);
router.post('/search/email/check', userCtrl.checkEmail);
router.post('/search/email/replace', userCtrl.changePwd);


module.exports = router;