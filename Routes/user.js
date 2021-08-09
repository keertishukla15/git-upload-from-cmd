const express = require('express');
const router = express.Router();
const user = require('../Controllers/user.js');


router.post('/users', user.singup);
router.post('/users/login', user.signin);


router.post('/users/login/GetUserData',user.varification, user.getdata);

router.delete('/users/login/DeleteUserData/:id', user.deletedata);


router.put('/users/login/UpdateUserData/:id', user.Updatedata);

module.exports = router;
