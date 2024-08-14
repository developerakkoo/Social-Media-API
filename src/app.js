const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const helmet = require("helmet");
require("./scheduler/deletePost.scheduler");
const { BASE_URL } = require("./constant");
const { errorHandler } = require("./middleware/error.middlewares");

app.use(cors());

/**
 * Sets the response headers to allow cross-origin requests (CORS)
 * @param {import('express').Request} req - The request object
 * @param {import('express').Response} res - The response object
 * @param {Function} next - The next middleware function in the stack
 */
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE",
    );
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

/**
 * Sets the response headers to allow cross-origin requests (CORS)
 * @param {import('express').Request} req - The request object
 * @param {import('express').Response} res - The response object
 * @param {Function} next - The next middleware function in the stack
 */
app.use(
    helmet({
        frameguard: {
            action: "deny",
        },
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
        },
        referrerPolicy: {
            policy: "same-origin",
        },
    }),
);

//---------------------------------- Importing Routes -----------------------------------------//
const { verify_token } = require("./middleware/jwt_verify");
const { authRoutes } = require("./routes/auth.route");
const { messageRoutes } = require("./routes/message.route");
const { postRoutes } = require("./routes/post.route");
const { userRoutes } = require("./routes/user.route");

//---------------------------------- Routes Declaration -----------------------------------------//
app.use(`${BASE_URL}/auth`, authRoutes);
app.use(verify_token); // verifying jwt token and adding user id to req.userId
app.use(`${BASE_URL}/user`, userRoutes);
app.use(`${BASE_URL}/message`, messageRoutes);
app.use(`${BASE_URL}/post`, postRoutes);

//-----------------------------------------------------------------------------------------------//
app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, "constant/index.html"));
});

app.use(errorHandler);

module.exports = { app };
