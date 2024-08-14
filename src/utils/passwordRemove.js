
function removePassword(data){
    const user_Data = { ...data._doc };// removing password from response
    delete user_Data.password;
    return user_Data
}

module.exports = {
    removePassword
}