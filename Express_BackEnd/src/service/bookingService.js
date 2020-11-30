const userModel = require("../model/userModel");
const packageModel = require("../model/packageModel");
const bookingModel = require("../model/bookingModel");

let bookingService = {};

bookingService.createBooking = (bookingObj) => {
    let packageId = bookingObj.destId
    if (packageId[0] === "D") {
        return packageModel.getPackageById(packageId).then(packageDetail => {
            if (packageDetail.availability < bookingObj.noOfPersons) {
                let err = new Error("We have insufficient package available");
                err.status = 404;
                throw err
            } else {
                packageModel.UpdatingPackageAvailablilty(packageId, bookingObj.noOfPersons).then(updateRespose => {
                    if (updateRespose) {
                        console.log("Package Availability Updated");
                    }
                })
                return bookingModel.createBooking(bookingObj).then(bookingData => {
                    if (bookingData !== null) {
                        return userModel.updateBooking(bookingData.bookingId, bookingObj.userId).then(updateRespose => {
                            if (updateRespose) {
                                return bookingData
                            } else {
                                let err = new Error("Unable to book your package. Please contact us !!");
                                err.status = 404;
                                throw err
                            }
                        });
                    } else {
                        let err = new Error("Unable to book your package. Please try again later!!");
                        err.status = 404;
                        throw err
                    }
                })
            }
        });
    } else if (packageId[0] === "H") {
        return packageModel.getHotdealsById(packageId).then(hotdealDetail => {
            if (hotdealDetail.availability < bookingObj.noOfPersons) {
                let err = new Error("We have insufficient package available");
                err.status = 404;
                throw err
            } else {
                packageModel.UpdatingHotDealAvailablilty(packageId, bookingObj.noOfPersons).then(updateRespose => {
                    if (updateRespose) {
                        console.log("Hotdeal Availability Updated");
                    }
                })
                return bookingModel.createBooking(bookingObj).then(bookingData => {
                    if (bookingData !== null) {
                        return userModel.updateBooking(bookingData.bookingId, bookingObj.userId).then(updateRespose => {
                            if (updateRespose) {
                                return bookingData
                            } else {
                                let err = new Error("Unable to book your package. Please contact us !!");
                                err.status = 404;
                                throw err
                            }
                        });
                    } else {
                        let err = new Error("Unable to book your package. Please try again later!!");
                        err.status = 404;
                        throw err
                    }
                })
            }
        })
    }
}

bookingService.getBookingDetails = (contactNo) => {
    return userModel.checkUser(contactNo).then(userDetail => {
        return bookingModel.getBookingDetails(userDetail.bookings).then(userBookingData => {
            if (userBookingData !== null) {
                return userBookingData
            } else {
                let err = new Error("You currently don't have any booking");
                err.status = 404;
                throw err
            }
        })
    })
}

bookingService.deleteBooking = (bookingObj) => {
    return bookingModel.deleteBooking(bookingObj.bookingId).then(deleteRespose => {
        if (deleteRespose) {
            if (bookingObj.destId[0] === "D") {
                packageModel.increasePackageCount(bookingObj.destId, bookingObj.noOfPersons).then(updateRespose => {
                    if (updateRespose) {
                        console.log("Availability Increased");
                    }
                })
            } else if (bookingObj.destId[0] === "H") {
                packageModel.increaseHotDealCount(bookingObj.destId, bookingObj.noOfPersons).then(updateRespose => {
                    if (updateRespose) {
                        console.log("Hotdeal Availability Increased");
                    }
                })
            }
            return userModel.deleteBooking(bookingObj.userId, bookingObj.bookingId).then(updatedUserDetail => {
                if (updatedUserDetail !== null) {
                    return updatedUserDetail
                } else {
                    let err = new Error("Unable to delete your booking");
                    err.status = 404;
                    throw err
                }
            })
        }
    })
}
module.exports = bookingService;