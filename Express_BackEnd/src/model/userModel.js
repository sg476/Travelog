const userDetails = require('./beanClasses/users');
const connection = require("../utilities/connections")

const usersDB = {}

usersDB.generateId = () => {
    return connection.getUserCollection().then((userModel) => {
        return userModel.distinct("userId").then((ids) => {
            let lastIdNumber = Number(ids.pop().split("U")[1])
            let newIdNumber = lastIdNumber + 1;
            return ("U" + newIdNumber)
        })
    })
}
usersDB.checkUser = (contactNo) => {
    return connection.getUserCollection().then((collection) => {
        return collection.findOne({ "contactNo": contactNo }).then((customerContact) => {
            if (customerContact) {
                return new userDetails(customerContact);
            }
            else return null;
        })
    })
}

usersDB.getPassword = (contactNo) => {
    return connection.getUserCollection().then((collection) => {
        return collection.find({ "contactNo": contactNo }, { _id: 0, password: 1 }).then((password) => {
            if (password.length != 0)
                return password[0].password;
            else
                return null;
        })
    })
}

usersDB.createNewUser = (userDetails) => {
    return connection.getUserCollection().then((userModel) => {
        return usersDB.generateId().then((newUserId) => {
            userDetails.userId = newUserId;
            return userModel.create(userDetails).then((insertedData) => {
                if (insertedData) {
                    return insertedData
                } else {
                    return null
                }
            });
        });
    });
}

usersDB.updateBooking = (bookingId, userId) => {
    return connection.getUserCollection().then(userModel => {
        return userModel.updateOne({ userId: userId }, { $push: { bookings: bookingId } }, { runValidators: true }).then(updatedData => {
            if (updatedData.nModified > 0) {
                return true
            } else {
                console.log("Unable to update booking in user");
            }
        })
    })
}

usersDB.deleteBooking = (userId, bookingId) => {
    return connection.getUserCollection().then(userModel => {
        return userModel.updateOne({ userId: userId }, { $pull: { bookings: bookingId } }, { runValidators: true }).then(updatedData => {
            if (updatedData.nModified > 0) {
                return userModel.findOne({ userId: userId }).then(userDetail => {
                    if (userDetail.length !== 0) {
                        return userDetail
                    } else {
                        return null
                    }
                });
            }
        });
    });
}

module.exports = usersDB;
