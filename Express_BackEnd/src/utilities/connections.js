const { Schema } = require("mongoose");
const Mongoose = require("mongoose")
Mongoose.Promise = global.Promise;
const url = "mongodb://localhost:27017/Wanderlust_DB";

let userSchema = Schema({
    name: String,
    userId: String,
    emailId: String,
    contactNo: Number,
    password: String,
    bookings: [String]
}, { collection: "User" })

let bookingSchema = Schema({
    bookingId: String,
    userId: String,
    destId: String,
    destinationName: String,
    checkInDate: String,
    checkOutDate: String,
    noOfPersons: Number,
    totalCharges: Number,
}, { collection: "Booking Details", timestaps: true })

let destinationSchema = Schema({
    destinationId: String,
    continent: String,
    imageUrl: String,
    name: String,
    details: {
        about: String,
        itinerary: {
            dayWiseDetails: {
                firstDay: String,
                restDaysSightSeeing: [String],
                lastDay: String
            },
            packageInclusions: [String],
            tourHighlights: [String],
            tourPace: [String]
        }
    },
    noOfNights: Number,
    flightCharges: Number,
    chargesPerPerson: Number,
    discount: Number,
    availability: Number
}, { collection: "Destination Package" })

let hotdealSchema = Schema(destinationSchema, { collection: "Hotdeal Package" })

let collection = {};

collection.getUserCollection = () => {
    return Mongoose.connect(url, { useNewUrlParser: true }).then((database) => {
        return database.model('User', userSchema)
    }).catch((error) => {
        let err = new Error("Could not connect to Database");
        err.status = 500;
        throw err;
    })
}

collection.getBookingCollection = () => {
    return Mongoose.connect(url, { useNewUrlParser: true }).then((database) => {
        return database.model('Booking Detail', bookingSchema)
    }).catch((error) => {
        let err = new Error("Could not connect to Database");
        err.status = 500;
        throw err;
    })
}

collection.getDestinationCollection = () => {
    return Mongoose.connect(url, { useNewUrlParser: true }).then((database) => {
        return database.model('Destination Package', destinationSchema)
    }).catch((error) => {
        let err = new Error("Could not connect to Database");
        err.status = 500;
        throw err;
    })
}

collection.getHotdealCollection = () => {
    return Mongoose.connect(url, { useNewUrlParser: true }).then((database) => {
        return database.model('Hotdeal Package', hotdealSchema)
    }).catch((error) => {
        let err = new Error("Could not connect to Database");
        err.status = 500;
        throw err;
    })
}

module.exports = collection;
