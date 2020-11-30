const connection = require("../utilities/connections");
const destinationDb = require('./databaseFiles/destinationDb.json');
const hotdealdb = require('./databaseFiles/hotdealDb.json');


let userData = [
    { userId: "U1001", name: "abc", emailId: "abc@gmail.com", contactNo: 9098765432, password: "Abc@1234", bookings: ["B1001", "B1002"] },
    { userId: "U1002", name: "def", emailId: "def@gmail.com", contactNo: 6234567890, password: "Def@1234", bookings: ["B1003"] }
]

let bookingData = [
    { bookingId: "B1001", userId: "U1001", destId: "D1001", destinationName: "A Week in Greece: Athens, Mykonos & Santorini", checkInDate: "2018-12-09", checkOutDate: "2018-12-16", noOfPersons: 2, totalCharges: 5998 },
    { bookingId: "B1002", userId: "U1001", destId: "D1002", destinationName: "Romantic Europe: Paris, Venice & Vienna", checkInDate: "2019-1-10", checkOutDate: "2019-1-24", noOfPersons: 1, totalCharges: 4549 },
    { bookingId: "B1003", userId: "U1002", destId: "D1002", destinationName: "Romantic Europe: Paris, Venice & Vienna", checkInDate: "2019-1-10", checkOutDate: "2019-1-24", noOfPersons: 1, totalCharges: 4549 }
]

let destinations = destinationDb;
let hotdeal = hotdealdb;

let dataSetUp = {}
dataSetUp.userSetup = () => {
    return connection.getUserCollection().then((myCollection) => {
        return myCollection.deleteMany().then((data) => {
            return myCollection.insertMany(userData).then((data) => {
                if (data) {
                    return "Insertion Successfull"
                } else {
                    throw new Error("Insertion failed")
                }
            })
        })

    })
}

dataSetUp.bookingSetup = () => {
    return connection.getBookingCollection().then((bookingModel) => {
        return bookingModel.deleteMany().then((data) => {
            return bookingModel.insertMany(bookingData).then((data) => {
                if (data) {
                    return "Insertion Successfull"
                } else {
                    throw new Error("Insertion Failed")
                }
            })
        })
    })
}

dataSetUp.destinationSetup = () => {
    return connection.getDestinationCollection().then((destinationModel) => {
        return destinationModel.deleteMany().then((data) => {
            return destinationModel.insertMany(destinations).then((data) => {
                if (data) {
                    return "Insertion Successfull"
                } else {
                    throw new Error("Insertion Failed")
                }
            })
        })
    })
}

dataSetUp.hotdealSetup = () => {
    return connection.getHotdealCollection().then((HotdealModel) => {
        return HotdealModel.deleteMany().then((data) => {
            return HotdealModel.insertMany(hotdeal).then((data) => {
                if (data) {
                    return "Insertion Successfull"
                } else {
                    throw new Error("Insertion Failed")
                }
            })
        })
    })
}

module.exports = dataSetUp;