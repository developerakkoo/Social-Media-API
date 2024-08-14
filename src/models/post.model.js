const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');
const postSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        select: false,
        require:true
    },
    postUrl:{
        type:String,
        require:true
    },
    path:{
        type:String,
        require:true
    },
    description:{
        type:String,
    },
    likes:{
        type:[{
            likedUserId:{
                type:Schema.Types.ObjectId,
                ref:"User",
                require:true
            },
            createdAt:{
                type:String,
                default:moment().format()
            }
        }]
    },
    comments:{
        type:[{
            userId:{
                type:Schema.Types.ObjectId,
                ref:"User",
            },
            comment:{
                type:String
            }
        }]
    },
    deletionTime:{
        type: Date, 
        default: Date.now,
    },
},{timestamps:true});



module.exports = mongoose.model("posts", postSchema);