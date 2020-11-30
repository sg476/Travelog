const userDB = require('../model/userModel');

const userService = {}

//login a user
userService.login = (contactNo, userPassword) => {
    return userDB.checkUser(contactNo).then((user) => {
        if (user == null) {
            let err = new Error("Enter registered contact number! If not registered, please register")
            err.status = 404
            throw err
        }
        else {
            return userDB.getPassword(contactNo).then((password) => {
                if (password != userPassword) {
                    let err = new Error("Incorrect password")
                    err.status = 406
                    throw err
                }
                else {
                    return user;
                }
            })
        }
    })
}

userService.register = (userDetails) => {
    return userDB.checkUser(userDetails.contactNo).then((user) => {
        if (user !== null) {
            let err = new Error("Contact number already exist!! Please change the number and try again.")
            err.status = 404
            throw err
        } else {
            return userDB.createNewUser(userDetails).then((registerResponse) => {
                if (registerResponse !== null) {
                    return "Registration successfull"
                } else {
                    let error = new Error("Unable of register. Please, try again later !!");
                    error.status = 404
                    throw error
                }
            })
        }
    })
}

module.exports = userService
