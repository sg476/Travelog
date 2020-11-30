const connection = require("../utilities/connections");

const bookingDB = {};

bookingDB.generateId = () => {
    return connection.getBookingCollection().then(bookingModel => {
        return bookingModel.distinct("bookingId").then((ids) => {
            let lastIdNumber = Number(ids.pop().split("B")[1])
            let newIdNumber = lastIdNumber + 1;
            return ("B" + newIdNumber)
        });
    });
}

bookingDB.createBooking = (bookingObj) => {
    return connection.getBookingCollection().then(bookingModel => {
        return bookingDB.generateId().then(bookingId => {
            bookingObj.bookingId = bookingId;
            return bookingModel.create(bookingObj).then(insertedData => {
                if (insertedData) {
                    return insertedData
                } else {
                    return null
                }
            });
        });
    });
}

bookingDB.getBookingDetails = (bookingIdArray) => {
    return connection.getBookingCollection().then(bookingModel => {
        return bookingModel.find({ bookingId: { $in: bookingIdArray } }, { _id: 0, _v: 0 }).then(bookingData => {
            if (bookingData.length !== 0) {
                return bookingData
            } else {
                return null
            }
        });
    });
}

bookingDB.deleteBooking = (bookingId) => {
    return connection.getBookingCollection().then(bookingModel => {
        return bookingModel.deleteOne({ bookingId: bookingId }).then(deletedData => {
            if (deletedData.n > 0) {
                return true
            } else {
                return false
            }
        });
    });
}

module.exports = bookingDB;

