const express = require('express');
const router = express.Router();
const setupPackageModel = require('../model/setupDb');
const packageModel = require('../model/packageModel');

//SetupDB
router.get('/DestinationSetup', (req, res, next) => {
    setupPackageModel.destinationSetup()
        .then((responce) => {
            res.send(responce)
        })
        .catch((error) => {
            next(error)
        })
})
router.get('/hotdealSetup', (req, res, next) => {
    setupPackageModel.hotdealSetup()
        .then((response) => {
            res.send(response)
        })
        .catch((error) => {
            next(error)
        })
})

router.get('/destinations/:continent', (req, res, next) => {
    let placeToSearch = req.params.continent
    packageModel.getPackage(placeToSearch)
        .then((packageDetailResponse) => {
            if (packageDetailResponse !== null) {
                res.send(packageDetailResponse)
            }
        })
})

router.get('/hotdeals', (req, res, next) => {
    packageModel.getHotdeals()
        .then((hotdealResponse) => {
            if (hotdealResponse !== null) {
                res.send(hotdealResponse)
            }
        })
})

module.exports = router;