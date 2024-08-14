module.exports = {
    DB_NAME: "socialNetwork",
    BASE_URL: "/api/v1",
    hash: 12,
    validationMessage: {
        userRegistration: {
            userNameValidationMessage:"Please enter a valid name. Names should only contain letters and must not be left blank. Thank you!",
            userNickNameValidationMessage:"Please enter a valid nick name. It should be at least 2 characters long. Thank you!",
            userPasswordValidationMessage:`Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number and special character '! @ # $ % ^ & * ?'`,
            userEmailValidationMessage:"Please enter a valid email address. Thank you!",
            userPhoneNumberValidationMessage:"Please enter a valid phone number. Thank you!",
            userDateOfBirthValidationMessage:"Please enter a valid date of birth. The formate should be (yyyy-MM-dd). Thank you!",
            userGenderValidationMessage:"This field is required. Thank you!",
            userPreferredGenderValidationMessage:"This field is required. Thank you!",
            userArLocationValidationMessage:"This field is required. Thank you!",
            userInterestValidationMessage:"This field is required and needs to be an array. Thank you!",
        },
        require:"This field is required. Thank you!"
    },
    responseMessage:{
        userMessage:{
            userExist:'A user with this phone number or email already exists. Please use a different phone number or email. Thank you!',
            userNotCreated:'Something went wrong while registering the customer. Please try again later or contact support for assistance. Thank you.',
            userCreated:"User registered successfully. Welcome aboard!"
        }
    }
};
