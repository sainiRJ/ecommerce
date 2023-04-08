const express = require('express');

const authController = require('../controllers/auth');

const User = require('../models/user');

const {check,body} = require('express-validator/check')

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('valid email type kro')
      .normalizeEmail(),
    body('password', 'password ko number aur letter aur km se km 5 letter typw kro')
      .isLength({min:5})
      .isAlphanumeric()
      .trim()
  ],
  authController.postLogin);

router.post('/signup',
[
check('email')
.isEmail()
.withMessage('valid email type kro') 
.custom((value, {req})=>{
    // if(value === "rajeshpushpakar01@gmail.com"){
    //     throw new Error ("ye email confidential hai ise use na kre")
    // }
    // return true
    return User.findOne({ email: value })
    .then((userValidation) => {
      if (userValidation) {
        return Promise.reject(
            'Email pahle se hai, doosra email type kre'
        )
      }
    })
})
.normalizeEmail(),
body('password', 'password ko number aur letter aur km se km 5 letter typw kro')
.isLength({min:5})
.isAlphanumeric()
.trim(),
body('confirmPassword')
.trim()
.custom((value, {req})=>{
    if(value !==req.body.password){
        throw new Error('Password match nhi kr rha')
    }
    return true;
})
]
,authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset',authController.getReset);

router.post('/reset',authController.postreset);

router.get('/reset/:token',authController.getNewPassowrd)

router.post('/new-password',authController.postNewPassword)


module.exports = router;