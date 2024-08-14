const { body, validationResult }= require('express-validator');



exports.dataValidationResult = async (req,res,next)=>{
    try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array())
    }
    next();
    }
    catch(error){
        console.log(error);
        res.status(400).json({message:error.message})
    }
}


exports.validateUserCreation = [
    body('email').notEmpty().withMessage('Email Is Require'),
    body('email').isEmail().withMessage('Please Enter A Valid Email Address '),
    body('phoneNumber').notEmpty().withMessage('Phone Number Require'),
    body('phoneNumber').isMobilePhone('en-IN').withMessage('Please Enter A Valid Phone Number'),
    body('password').isStrongPassword({
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
    }).withMessage(`Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number and special character '! @ # $ % ^ & * ?'`),
]

exports.validateUserLogin = [
    body('email').notEmpty().withMessage('Email Is Require'),
    body('email').isEmail().withMessage('Please Enter A Valid Email Address '),
    body('password').notEmpty().withMessage('Email Is Require'),
]

exports.validateSendMessage = [
    body('receiverId').notEmpty().withMessage('Receiver Id Is Require'),
    body('message').notEmpty().withMessage('Message Is Require'),
]

// exports.validateSubCategoryData = [
//     body('name').isLength({min:2}).withMessage('Region Name Needs to be minimum 2 latter,Please Enter A Valid Region Name'),
//     body('categoryId').notEmpty().withMessage('Category Id Is Require'),
//     body('description').isLength({min:2}).withMessage('Description Needs to be minimum 4,Please Enter A Valid Zone Name'),
// ]

// exports.validateMakeData = [
//     body('name').isLength({min:2}).withMessage('Region Name Needs to be minimum 2 latter,Please Enter A Valid Region Name'),
//     body('categoryId').notEmpty().withMessage('Category Id Is Require'),
//     body('subCategoryId').notEmpty().withMessage('Main Category Id Is Require'),
//     body('description').isLength({min:2}).withMessage('Description Needs to be minimum 4,Please Enter A Valid Zone Name'),
// ]

// exports.validateVehicleModelData = [
//     body('name').isLength({min:2}).withMessage('Region Name Needs to be minimum 2 latter,Please Enter A Valid Region Name'),
//     body('categoryId').notEmpty().withMessage('Main Category Id Is Require'),
//     body('subCategoryId').notEmpty().withMessage('Main Category Id Is Require'),
//     body('makeId').notEmpty().withMessage('MakeId Is Require'),
//     body('description').isLength({min:2}).withMessage('Description Needs to be minimum 4,Please Enter A Valid Zone Name'),
// ]

