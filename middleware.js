const Listing = require('./models/listing');
const Review = require('./models/review');


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        //redirect url save
        req.session.redirecturl=req.originalUrl;
        req.flash('error','You must be logged in to create a new listing');
        return res.redirect('/login');
    }
    next();

};

module.exports.saveRedirect=(req,res,next)=>{
    if(req.session.redirecturl){
        res.locals.redirecturl= req.session.redirecturl;
        // return res.redirect(req.session.redirecturl);
    };
    next();
}

// Middleware to check ownership of a listing
module.exports.isOwner=async(req,res,next)=>{
    let {id} = req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)){
        req.flash('error','You do not have permission to edit this listing');
        return res.redirect(`/listings/${id}`);
    };
    next();
};

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,review_id} = req.params;
    let review=await Review.findById(review_id);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash('error','You do not the author of the is review');
        return res.redirect(`/listings/${id}`);
    };
    next();
}