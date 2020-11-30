const express = require('express');
const router = express.Router();
const setupUser = require("../model/setupDb")
const userservice = require('../service/userService')
const Users = require('../model/beanClasses/users')

//setupDB
router.get("/setup", (req, res, next) => {
    setupUser.userSetup()
        .then((data) => {
            res.send(data)
        })
        .catch(err => next(err));
})

//router to login
router.post('/login', function (req, res, next) {
    let contactNo = req.body.contactNo;
    let password = req.body.password;
    userservice.login(parseInt(contactNo), password)
        .then(function (userDetails) {
            res.json(userDetails);
        })
        .catch(err => next(err));
})

router.post('/register', (req, res, next) => {
    let userDetailObj = new Users(req.body);
    userservice.register(userDetailObj)
        .then((response) => {
            res.send(response);
        })
        .catch(err => next(err));
})

module.exports = router;

