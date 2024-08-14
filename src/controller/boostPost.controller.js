const BoostPost = require('../models/boostPost');


exports.selectPostToBoost = async(req,res) => {
    try {
        const postObj = {
            userId:req.userId,
            postId:req.body.postId
        }
        res.status(200).json({message:'Successfully',statusCode:200,data:''});
    } catch (error) {
        res.status(500).json({message:error.message,status:'ERROR',statusCode:500});
    }
}