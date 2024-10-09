const Review = require('../models/review');
const Listing = require('../models/listing'); // Import the Listing model
const { model } = require('mongoose');


module.exports.addReviews=async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
        throw new ExpressError(404, 'Listing not found');
    }

    let newReview = new Review(req.body.review);
    newReview.author=req.user._id; 
    listing.reviews.push(newReview); // Add review to the listing's reviews array
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${req.params.id}`);
}

module.exports.deleteReview=async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
        throw new ExpressError(404, 'Listing not found');
    }

    // Remove review from the listing
    await Review.findByIdAndDelete(req.params.review_id);
    await listing.save();
    res.redirect(`/listings/${req.params.id}`);
}