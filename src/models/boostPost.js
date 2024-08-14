const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const boostPostSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    postId:{
        type: Schema.Types.ObjectId,
        ref:"posts",
        require:true
    },
    accountReach:{
        type:String,
        require:true
    },
    messageStatus:{
        type:String,
        require:true
    }
},{timestamps:true});


module.exports = mongoose.model("BoostedPost",boostPostSchema)