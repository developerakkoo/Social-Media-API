const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    senderId:{
        type: Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    receiverId:{
        type: Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    message:{
        type:String,
        require:true
    },
    messageStatus:{
        type:String,
        require:true
    }
},{timestamps:true});


module.exports = mongoose.model("messages",messageSchema)