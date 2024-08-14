const { body, param, query, validationResult } = require("express-validator");
const { ApiError } = require("../utils/ApiErrorHandler");
const { validationMessage } = require("../constant");

/**
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 */
exports.dataValidationResult = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ApiError(400, errors.array());
            // return res.status(400).json(errors.array())
        }
        next();
    } catch (error) {
        console.log(error);
        throw new ApiError(400, errors.message);
        res.status(400).json({ message: error.message });
    }
};

exports.validateRegisterUser = [
    body("name")
        .notEmpty()
        .isString()
        .isLength({ min: 2 })
        .withMessage(
            validationMessage.userRegistration.userNameValidationMessage,
        ),
    body("nickName")
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage(
            validationMessage.userRegistration.userNickNameValidationMessage,
        ),
    body("email").notEmpty().withMessage(validationMessage.require),
    body("email")
        .isEmail()
        .withMessage(
            validationMessage.userRegistration.userEmailValidationMessage,
        ),
    body("phoneNumber").notEmpty().withMessage(validationMessage.require),
    body("phoneNumber")
        .isMobilePhone("en-IN")
        .withMessage(
            validationMessage.userRegistration.userPhoneNumberValidationMessage,
        ),
    body("password")
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
            returnScore: false,
            pointsPerUnique: 1,
            pointsPerRepeat: 0.5,
            pointsForContainingLower: 10,
            pointsForContainingUpper: 10,
            pointsForContainingNumber: 10,
            pointsForContainingSymbol: 10,
        })
        .withMessage(
            validationMessage.userRegistration.userPasswordValidationMessage,
        ),
    body("dateOfBirth")
        .notEmpty()
        .isDate({ format: "yyyy-MM-dd" })
        .withMessage(
            validationMessage.userRegistration.userDateOfBirthValidationMessage,
        ),
    body('gender').notEmpty().withMessage(validationMessage.userRegistration.userGenderValidationMessage),
    body('preferred_gender').notEmpty().withMessage(validationMessage.userRegistration.userPreferredGenderValidationMessage),
    body('ar_location').notEmpty().withMessage(validationMessage.userRegistration.userArLocationValidationMessage),
    body('interest').isArray().withMessage(validationMessage.userRegistration.userInterestValidationMessage)
];
