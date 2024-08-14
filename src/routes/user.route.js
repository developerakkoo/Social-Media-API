const route =  require('express').Router();
const userCtrl = require('../controller/user.controller');
const dataValidator =  require('../middleware/dataValidator');
const busboy = require('connect-busboy');
route.post('/create/user',[dataValidator.validateUserCreation,dataValidator.dataValidationResult],userCtrl.createUser);

route.post('/login/user',[dataValidator.validateUserLogin,dataValidator.dataValidationResult],userCtrl.loginUser);

route.put('/update/user',userCtrl.editUserProfile);

route.put('/edit-user/profileImages',userCtrl.editUserProfileImages);

route.get('/get-user-profile',userCtrl.getUserProfile);

route.delete('/delete-user-profile',userCtrl.deleteUserProfile);


module.exports =  { userRoutes : route }