let express = require('express');
const router = express.Router({mergeParams:true});
const { listingSchema, reviewSchema } = require('../schema'); // Assuming you have schemas defined here
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const Review = require('../models/review');
const Listing = require('../models/listing'); // Import the Listing model
const { isLoggedIn ,isReviewAuthor} = require('../middleware');
const controllerReviews=require("../Contollers/reviews")
// Middleware to validate reviews
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

// Create review route
router.post('/', isLoggedIn, validateReview, wrapAsync(controllerReviews.addReviews));

// Delete review route
router.delete('/:review_id',isLoggedIn,isReviewAuthor, wrapAsync(controllerReviews.deleteReview));

// Export the router
module.exports = router;
