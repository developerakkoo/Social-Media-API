const User = require("../models/user.model");
const { ApiError } = require("../utils/ApiErrorHandler");
const { ApiResponse } = require("../utils/ApiResponseHandler");
const { asyncHandler } = require("../utils/asyncHandler");
const { clearFile } = require("../utils/deleteFile");
const { responseMessage } = require("../constant");
const busboy = require("busboy");
const path = require("path");
require("dotenv").config();
const fs = require("fs");

/**
 *  @function createRegister 
 * @async
 * @param {import("express").Request} req - Express request object
 * @param {import("express").Response} res - Express response object
 * @returns {object} The response object.
 * @description This asynchronous function handles the registration of a user. 
 * It extracts user details from the request body, checks for existing user, 
 * creates a new user, and returns the registered user details in the response.
 */
exports.createRegister = async (req, res) => {
    const {
        name,
        nickName,
        email,
        phoneNumber,
        dateOfBirth,
        gender,
        password,
        preferred_gender,
        ar_location,
        interest
    } = req.body;

    /**
     * Check if the user already exists.
     */
    const checkUserExist = User.findOne({
        $or: [{ email }, { phoneNumber }],
    });
    if (checkUserExist) {
        return res.status(400).json({
            status: "Failure",
            message: "User already exists",
        });
    }

    /**
     * Create the new user.
     */
    const user = await User.create({
        name: name.toLowerCase(),
        nickName,
        email,
        phoneNumber,
        dateOfBirth,
        gender,
        password,
        preferred_gender,
        ar_location,
        interest,
    });

    /**
     * Check user created successfully and remove password, refresh token.
     */
    const createdUser = await User.findById(user._id);
    if (!createdUser) {
        return res.status(400).json({
            status: "Failure",
            message: "Failed to create user",
        });
    }

    return res.status(201).json({
        status: "Success",
        message: "User created",
        data: {
            userId: createdUser._id,
        },
    });
};

exports.loginUser = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const savedUser = await User.findOne({ email: email });
        if (!savedUser) {
            return res.status(404).json({
                message: `User not found with this email ${req.body.email}`,
                statusCode: 404,
            });
        }
        if (!(await bcrypt.compare(password, savedUser.password))) {
            return res
                .status(401)
                .json({ message: `Incorrect Password`, statusCode: 401 });
        }
        const payload = {
            userId: savedUser._id,
            email: savedUser.email,
        };
        const token = await jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: "24h",
        });
        const postResponse = {
            User: savedUser.name,
            Id: savedUser._id,
            accessToken: token,
        };
        res.status(200).json({
            message: `User login successfully`,
            statusCode: 200,
            data: postResponse,
        });
    } catch (error) {
        res.status(500).json({
            Message: error.message,
            status: "ERROR",
            statusCode: 500,
        });
    }
};

exports.editUserProfile = async (req, res) => {
    try {
        // console.log(req.params);
        const savedUser = await User.findById(req.userId);
        savedUser.name =
            req.body.name != undefined ? req.body.name : savedUser.name;

        savedUser.email =
            req.body.email != undefined ? req.body.email : savedUser.email;

        savedUser.phoneNo =
            req.body.phoneNo != undefined
                ? req.body.phoneNo
                : savedUser.phoneNo;

        savedUser.nickName =
            req.body.nickName != undefined
                ? req.body.nickName
                : savedUser.nickName;

        savedUser.dateOfBirth =
            req.body.dateOfBirth != undefined
                ? req.body.dateOfBirth
                : savedUser.dateOfBirth;

        savedUser.gender =
            req.body.gender != undefined ? req.body.gender : savedUser.gender;

        savedUser.preferredGender =
            req.body.preferredGender != undefined
                ? req.body.preferredGender
                : savedUser.preferredGender;

        savedUser.findMatchInDistance =
            req.body.findMatchInDistance != undefined
                ? req.body.findMatchInDistance
                : savedUser.findMatchInDistance;

        if (req.body.AddInterest) {
            const newInterestArray = req.body.AddInterest;
            newInterestArray.forEach((element) => {
                // Check if the newInterest already exists in the interests array
                const isInterestExists = savedUser.interest.some(
                    (item) => item.interest === element,
                );
                if (!isInterestExists) {
                    savedUser.interest.push({ interest: element });
                }
            });
        }
        if (req.body.removeInterest) {
            let UpdatedInterestArray = [];
            const removeInterestArray = req.body.removeInterest;
            removeInterestArray.forEach((element) => {
                let removeInterestId = element.toString();
                // remove item from array and save the array
                UpdatedInterestArray = savedUser.interest.filter(
                    (item) => item._id.toString() !== removeInterestId,
                );
            });
            savedUser.interest = UpdatedInterestArray;
        }
        const updatedUser = await savedUser.save();
        const userData = removePassword(updatedUser);
        res.status(201).json({
            message: `User Updated Successfully`,
            data: userData,
        });
    } catch (error) {
        res.status(500).json({ message: error.message, status: "ERROR" });
    }
};

exports.editUserProfileImages = async (req, res) => {
    try {
        const bb = busboy({
            headers: req.headers,
        });
        const filePromises = [];
        bb.on("file", (fieldname, file, info) => {
            console.log(info);
            const storeFileName = `uploads/${info.filename}`; // Modify the path format here
            const storeFile = path.join(__dirname, `../${storeFileName}`);
            const writeStream = fs.createWriteStream(storeFile);
            file.pipe(writeStream);

            filePromises.push(
                new Promise((resolve, reject) => {
                    writeStream.on("finish", () => resolve(storeFileName));
                    writeStream.on("error", (error) => reject(error));
                }),
            );
        });
        bb.on("finish", async () => {
            const filePaths = await Promise.all(filePromises);
            const savedUser = await User.findById(req.userId);
            filePaths.forEach((element) => {
                savedUser.images.push({
                    relativePath: element,
                    link: `${req.protocol}://${req.hostname}/${element}`,
                });
            });
            const updatedUser = await savedUser.save();
            res.status(201).json({
                message: `File Updated Successfully`,
                data: updatedUser,
            });
        });
        req.pipe(bb);
    } catch (error) {
        res.status(500).json({
            message: error.message,
            status: "ERROR",
            statusCode: 500,
        });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const userProfile = await User.findById(req.userId).select("-password");
        res.status(200).json({
            message: "User Profile Fetched Successfully",
            statusCode: 200,
            data: userProfile,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
            status: "ERROR",
            statusCode: 500,
        });
    }
};

exports.deleteUserProfile = async (req, res) => {
    try {
        const savedUser = await User.findById(req.userId);
        savedUser.images.forEach((element) => {
            clearFile(element.relativePath);
        });
        await User.deleteOne({ _id: req.userId });
        res.status(200).json({
            message: "User Profile Deleted Successfully",
            statusCode: 200,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
            status: "ERROR",
            statusCode: 500,
        });
    }
};
