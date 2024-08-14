const User = require('../models/user.model');
const Feed = require('../models/post.model');
const {getIO} = require('../utils/socket');
const path = require('path');
const fs = require('fs');
const { fn } = require('moment');

exports.createPost = async(req,res) => {
    try {
        const bufferData = req.file.buffer;
        const storeFileName = `uploads/${req.file.originalname}`; // Modify the path format here
        const filePath = path.join(__dirname, `../${storeFileName}`);
        fs.writeFile(filePath, bufferData, async(err) => {
            if (err) {
                return res.status(400).json({message:'ERROR Post Not Uploaded ',statusCode:400});
            } else {
                const postObj ={ 
                    userId:req.userId,
                    postUrl:`${req.protocol}://${req.hostname}/storeFileName`,
                    path:storeFileName,
                }
                if (req.body.description) {
                    postObj.description = req.body.description
                }
                const createPost = await Feed.create(postObj);                
                res.status(200).json({message:'Post Uploaded Successfully',statusCode:200,data:createPost});
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message,status:'ERROR',statusCode:500});
    }
}


exports.getUserAllPosts = async(req,res) => {
    try {
        const savedPost = await Feed.find({userId:req.userId})
        .select(['-path','-__v'])
        .populate('likes.likedUserId',['-password','-createdAt','-interest','-findMatchInDistance',,'-preferredGender','-email',,'-dateOfBirth','-__v'])
        .populate('comments.userId',['-password','-createdAt','-interest','-findMatchInDistance',,'-preferredGender','-email',,'-dateOfBirth','-__v']).lean();
        res.status(200).json({message:'Your All Post Fetched Successfully',statusCode:200,count:savedPost.length,data:savedPost});
    } catch (error) {
        res.status(500).json({message:error.message,status:'ERROR',statusCode:500});
    }
}

exports.getPostById = async(req,res) => {
    try {
        const savedPost = await Feed.findById(req.params.postId)
        .select(['-path','-__v'])
        .populate('likes.likedUserId',['-password','-createdAt','-interest','-findMatchInDistance',,'-preferredGender','-email',,'-dateOfBirth','-__v'])
        .populate('comments.userId',['-password','-createdAt','-interest','-findMatchInDistance',,'-preferredGender','-email',,'-dateOfBirth','-__v']).lean();;
        res.status(200).json({message:'Post FetchedSuccessfully',statusCode:200,data:savedPost});
    } catch (error) {
        res.status(500).json({message:error.message,status:'ERROR',statusCode:500});
    }
}

exports.getAllPosts = async(req,res) => {
    try {
        const savedPost = await Feed.find()
        .select(['-path','-__v'])
        .populate('likes.likedUserId',['-password','-createdAt','-interest','-findMatchInDistance',,'-preferredGender','-email',,'-dateOfBirth','-__v'])
        .populate('comments.userId',['-password','-createdAt','-interest','-findMatchInDistance',,'-preferredGender','-email',,'-dateOfBirth','-__v']).lean();;
        res.status(200).json({message:'All Post Fetched Successfully',statusCode:200,count:savedPost.length,data:savedPost});
    } catch (error) {
        res.status(500).json({message:error.message,status:'ERROR',statusCode:500});
    }
}

exports.likePost = async(req,res) => {
    try {
        const savedPost = await Feed.findById(req.params.postId);
                  // Check if the userId already exists in the Likes array
                const isUserLikeExists = savedPost.likes.some(item =>item.likedUserId.toString() === req.userId)
                if (!isUserLikeExists) {
                    savedPost.likes.push({likedUserId:req.userId});
                }
                if (isUserLikeExists) {
                    let UpdatedLikesArray = []
                    const removeUserLike = req.userId    
                    // remove like from array and save the array
                        UpdatedLikesArray = savedPost.likes.filter(item => item.likedUserId.toString() !== removeUserLike);
                        savedPost.likes = UpdatedLikesArray;
                }
            const updatedPostLike =  await savedPost.save();
            getIO().emit(savedPost._id,{likes:savedPost.likes});
        res.status(200).json({message:'Success',statusCode:200,LikeCount:updatedPostLike.likes.length,data:updatedPostLike.likes});
    } catch (error) {
        res.status(500).json({message:error.message,status:'ERROR',statusCode:500});
    }
}

exports.commentPost = async(req,res) => {
    try {
        const savedPost = await Feed.findById(req.params.postId);
        savedPost.comments.push({userId:req.userId,comment:req.body.comment});
        const commentedPost = await savedPost.save();
        getIO().emit(commentedPost._id,{comments:commentedPost.comments});
        res.status(200).json({message:'Comment Added Successfully',statusCode:200,data:commentedPost});
    } catch (error) {
        res.status(500).json({message:error.message,status:'ERROR',statusCode:500});
    }
}

exports.deletePostComments = async(req,res) => {
    try {
        const savedPost = await Feed.findById(req.params.postId);

        let UpdatedCommentsArray = []   
        // remove like from array and save the array
        UpdatedCommentsArray = savedPost.comments.filter(item => item._id.toString() !== req.body.commentId );
        savedPost.comments = UpdatedCommentsArray;
        const commentedPost = await savedPost.save();
        getIO().emit(commentedPost._id,{comments:commentedPost.comments});
        res.status(200).json({message:'Comment Deleted Successfully',statusCode:200,count: commentedPost.comments.length,data:commentedPost.comments});
    } catch (error) {
        res.status(500).json({message:error.message,status:'ERROR',statusCode:500});
    }
}

exports.deletePost = async(req,res) => {
    try {
        const userPost = await Feed.find({_id:req.params.postId,userId:req.userId});
        if (userPost.length==0) {
            return res.status(400).json({message:"You Can Not Delete This Post Only Owner Of This Post Can Delete Th Post"})
        }
        // console.log(userPost[0]._id);
        await Feed.deleteOne({_id:userPost[0]._id});
        res.status(200).json({message:'Post Delete Successfully',statusCode:200});
    } catch (error) {
        res.status(500).json({message:error.message,status:'ERROR',statusCode:500});
    }
}