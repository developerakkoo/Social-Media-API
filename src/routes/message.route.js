const route = require('express').Router();
const messageCtrl = require('../controller/message.controller');
const dataValidator = require('../middleware/dataValidator');
const {verify_token} = require('../middleware/jwt_verify')


route.post('/send-message',[verify_token,dataValidator.validateSendMessage,dataValidator.dataValidationResult],messageCtrl.sendMessage);

route.get('/get/message-by-receiverId/:receiverId',messageCtrl.getAllMessageByReceiverId);

route.get('/getAll/messages',messageCtrl.getAllMessage);

route.delete('/delete/message/:messageId',messageCtrl.deleteMessage);


module.exports = {messageRoutes : route}