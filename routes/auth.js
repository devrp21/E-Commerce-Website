const express = require('express');
const { check, body } = require('express-validator/check');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', [
    body('email')
        .isEmail()
        .withMessage('Please Enter a valid email.')
        .normalizeEmail(),
    body('password', 'Password has to be valid.')
        .isLength({ min: 6 })
        .isAlphanumeric()
        .trim()
    ], authController.postLogin);


router.post('/signup', [check('email')
    .isEmail()
    .withMessage('Please Enter a valid email.')
    .custom((value, { req }) => {
        

        return User.findOne({ email: value })
            .then(userDoc => {
                if (userDoc) {
                    return Promise.reject('Email exists already, please pick a different one.');
                }
            });

    })
    .normalizeEmail(),
 
body('password', 'Please enter password with the number and character and min length is 6')
    .isLength({ min: 6 })
    .isAlphanumeric()
    .trim(),

body('confirmPassword')
    .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password have to match');
        }
        return true;
    }).trim()

], authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-pass', authController.postNewPassword);

module.exports = router;