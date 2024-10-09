const User = require('../models/user');

module.exports.signupconroller= (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signUp=async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser,(err)=>{
            if(err){
               return next(err);
                }
                req.flash('success', `${username} User signUp successfully `);
                res.redirect('/listings');
        });


    } catch (err) {
        req.flash('error', err.message);
        console.log(err.message);
        res.redirect('/signup');
    }
}

module.exports.loginController=async (req, res) => {
    res.render("users/login.ejs");
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
            }
            req.flash("success","you are logged out");
            res.redirect("/login");
    });
}