const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const { hash } = require("../constant");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
    {
        name: {
            type: String,
            require: true,
            default: "-",
        },
        nickName: {
            type: String,
            require: true,
            default: "-",
        },
        phoneNumber: {
            type: Number,
            require: true,
            unique: true,
        },
        email: {
            type: String,
            require: true,
            unique: true,
        },
        password: {
            type: String,
            require: true,
        },
        dateOfBirth: {
            type: String,
            require: true,
            default: "-",
        },
        gender: {
            type: String,
            require: true,
            default: "-",
        },
        preferredGender: {
            type: String,
            require: true,
            default: "-",
        },
        findMatchInDistance: {
            type: String,
            require: true,
            default: "-",
        },
        images: {
            type: [
                {
                    relativePath: {
                        type: String,
                    },
                    link: {
                        type: String,
                    },
                },
            ],
        },
        interest: {
            type: [
                {
                    interest: {
                        type: String,
                    },
                },
            ],
        },
        coordinates: {
            type: [Number],
            default: 0,
        },
        is_online: {
            type: Boolean,
            require: true,
            default: false,
        },
        arLocation: {
            type: String,
            require: true,
            default: "-",
        },
        refreshToken: {
            type: String,
            require: true,
            default: "-",
        },
    },
    { timestamps: true },
);

/**
 * Pre-save hook that encrypts the password before saving it to the database.
 * @param {import('mongoose').Document} doc - The document being saved.
 * @param {Function} next - A callback function to invoke after saving the document.
 */
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, hash);
});

/**
 * Compares the given plaintext password with the hashed password stored in the database.
 * @param {string} password - The plaintext password to compare with the hashed password.
 * @returns {boolean} `true` if the passwords match, `false` otherwise.
 */
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

/**
 * Generates an access token for the user.
 * @returns {string} The access token.
 */
userSchema.methods.generateAccessToken = async function () {
    const accessToken = jwt.sign(
        {
            _id: this._id,
            phoneNumber: this.phoneNumber,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        },
    );
    return accessToken;
};

/**
 * Generates a refresh token for the user.
 * @returns {string} The refresh token.
 */
userSchema.methods.generateRefreshToken = async function () {
    const refreshToken = jwt.sign(
        {
            _id: this._id,
            phoneNumber: this.phoneNumber,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        },
    );
    return refreshToken;
};

userSchema.index({ name: "text" }, { nickName: "text" });
module.exports = mongoose.model("User", userSchema);
