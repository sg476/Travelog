const express = require('express');
const router = express.Router();
const bookingService = require("../service/bookingService")
const setupBookingModel = require('../model/setupDb');

//SetUpDB
router.get('/setup', (req, res, next) => {
    setupBookingModel.bookingSetup()
        .then((responce) => {
            res.send(responce);
        })
        .catch((error) => {
            next(error)
        })
})

router.post('/createBooking', (req, res, next) => {
    let bookingObj = req.body;
    bookingService.createBooking(bookingObj).then(resposeBookingObj => {
        res.send(resposeBookingObj);
    }).catch(error => {
        next(error)
    })
})

router.get('/:contactNo', (req, res, next) => {
    let contactNo = Number(req.params.contactNo);
    bookingService.getBookingDetails(contactNo)
        .then(userBookingDetail => {
            if (userBookingDetail) {
                res.send(userBookingDetail);
            }
        })
        .catch(error => {
            next(error)
        })
})

router.put('/delete', (req, res, next) => {
    let deleteBookingObj = req.body;
    bookingService.deleteBooking(deleteBookingObj)
        .then(userBookingDetail => {
            if (userBookingDetail) {
                res.send(userBookingDetail);
            }
        })
        .catch(error => {
            next(error)
        })

})

module.exports = router;