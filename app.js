if(process.env.NODE_ENV !="production")
{
    require('dotenv').config()

}

let express = require('express');
const app = express();
let port = 8080;
let mongoose = require('mongoose');
const Listing = require('./models/listing');
const path = require('path');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const session=require("express-session");
const MongoStore = require('connect-mongo');

const ejsmate = require('ejs-mate');
const Review = require('./models/review');

const passport=require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const flash = require('connect-flash');

const listingsRouter=require("./routes/listing");
const reviewRoutes = require('./routes/review');
const userRoutes = require('./routes/user');


app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.engine('ejs', ejsmate);
app.use(express.static('public'));

const dburl=process.env.ATLASDB;

main().then(() => {
    console.log('connection done')
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect(dburl);
};

const store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})

store.on('error',()=>{
    console.log('Error in Mongo session store');
});

const sessionOption={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};




app.get('/', (req, res) => {
    res.redirect('/listings');
    // res.send('Hello World');
});


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});


// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
        
//         Email:"demouser@gmail.com",
//         username:"demouser",
//     });
//     let registerUser= await User.register(fakeUser,"helloworld");
// res.send(registerUser);
// });

app.use('/listings',listingsRouter);
app.use('/listings/:id/reviews', reviewRoutes);
app.use('/', userRoutes);


// app.get('/testlisting',async(req,res)=>{
//     let samplelisting=new Listing({
//         title:'my new villa',
//         description:'this is a new villa',
//         price:10000,
//         location:'paris',
//         // image:'https://www.example.com/image.jpg',
//         country:'Paris'
//     });
//     await samplelisting.save();
//     console.log(samplelisting);
//     res.send(samplelisting);
// });


// app.use((err ,req,res,next)=>{
//     res.send('something went wrong');
// });

app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'page Not found!'));
});

app.use((err, req, res, next) => {
    let status = err.status || 500;
    let message = err.message || "Something went wrong!";

    if (err instanceof ExpressError) {
        status = err.status;
        message = err.message;
    }
    res.status(status).render('./listings/error', { status, message });

});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});