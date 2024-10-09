let express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const Listing = require('../models/listing');
const { isLoggedIn, isOwner } = require("../middleware");
const { listingSchema } = require('../schema');

const listingController = require("../Contollers/listings");
const multer  = require('multer')

const {storage}=require("../cloudConfig");

const upload = multer({storage })




const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        // console.log(msg);
        throw new ExpressError(400, msg);
    } else {
        next(); 
    }
};



router.route('/')
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('listing[image]'),validateListing ,wrapAsync(listingController.NewListingCreate));

router.get('/new', isLoggedIn, listingController.renderNewForm);

router.route('/:id')
    .get( wrapAsync(listingController.viewDetailsListings))
    .put( isLoggedIn, isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, wrapAsync(listingController.deletelistingcontroller));




router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.EditListings));

module.exports = router;