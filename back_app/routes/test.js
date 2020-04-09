const express = require('express');
const router = express.Router();

const testCtrl = require('../controllers/test');

router.post('/touch', testCtrl.touch);

module.exports = router;