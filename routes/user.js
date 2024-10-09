const express = require('express');
const User = require('../models/user'); 
const passport = require('passport');
const router = express.Router();
const {saveRedirect}=require("../middleware");
const controllerUser=require("../Contollers/User");
// Signup route (GET)
router.get("/signup",controllerUser.signupconroller);

// Signup route (POST)
router.post("/signup", controllerUser.signUp);

router.get("/login", controllerUser.loginController);


router.post("/login",saveRedirect, passport.authenticate("local", {
    failureRedirect: '/login',
    failureFlash: true
}), (req, res) => {
    const { username } = req.body;
    req.flash('success', `Welcome back ${username}`);
    let redirecturl=res.locals.redirecturl||"/listings";
    res.redirect(redirecturl);
});

router.get("/logout",controllerUser.logout);

module.exports = router;
 