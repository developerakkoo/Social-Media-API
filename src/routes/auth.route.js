const route = require('express').Router();
const dataValidator = require('../middleware/dataValidator');
const userCtrl =  require('../controller/user.controller');


route.post('/create/user',[dataValidator.validateUserCreation,dataValidator.dataValidationResult],userCtrl.createUser);

route.post('/login/user',[dataValidator.validateUserLogin,dataValidator.dataValidationResult],userCtrl.loginUser);



module.exports =  { authRoutes : route }