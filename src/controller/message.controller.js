const User = require('../models/user.model');
const Messages = require('../models/message.model');
const {getIO} = require('../utils/socket');


exports.sendMessage= async(req,res) => {
    try {
        const msgObj = {
            senderId:req.userId,
            receiverId :req.body.receiverId,
            message:req.body.message
        }
        const messageSend = await Messages.create(msgObj); 
        getIO().emit(msgObj.receiverId,{data:messageSend});
        res.status(200).json({message:'Message send Successfully',statusCode:200,data:messageSend});
    } catch (error) {
        res.status(500).json({message:error.message,status:'ERROR',statusCode:500});
    }
}


exports.sendMultimediaMessage = async(req,res) => {
    try {
        const msgObj = {
            senderId:req.userId,
            receiverId :req.body.receiverId,
            message:req.file.message
        }
        const messageSend = await Messages.create(msgObj); 
        getIO().emit(msgObj.receiverId,{data:messageSend});
        res.status(200).json({message:'Message send Successfully',statusCode:200,data:messageSend});
    } catch (error) {
        res.status(500).json({message:error.message,status:'ERROR',statusCode:500});
    }
}


exports.getAllMessageByReceiverId = async(req,res) => {
    try {
        const savedMessage = await Messages.find({senderId:req.userId,receiverId:req.params.receiverId});
        res.status(200).json({message:'All Received Messages Fetched Successfully',statusCode:200,count:savedMessage.length,data:savedMessage});
    } catch (error) {
        res.status(500).json({message:error.message,status:'ERROR',statusCode:500});
    }
}

exports.getAllMessage = async(req,res) => {
    try {
        const savedMessage = await Messages.find({senderId:req.userId});
        res.status(200).json({message:'All Messages Fetched Successfully',statusCode:200,count:savedMessage.length,data:savedMessage});
    } catch (error) {
        res.status(500).json({message:error.message,status:'ERROR',statusCode:500});
    }
}

exports.deleteMessage = async(req,res) => {
    try {
        console.log(req.userId);
        const savedMessage = await Messages.findOne({senderId:req.userId,_id:req.params.messageId});
        if (!savedMessage) {
            await Messages.deleteOne({receiverId:req.userId,_id:req.params.messageId});
        }
        await Messages.deleteOne({senderId:req.userId,_id:req.params.messageId});
        res.status(200).json({message:'Messages Deleted Successfully',statusCode:200,});
    } catch (error) {
        res.status(500).json({message:error.message,status:'ERROR',statusCode:500});
    }
}

