const Listing = require('../models/listing');
const User = require('../models/user');
module.exports.index = async (req, res) => {
    let allListing = await Listing.find({});
    res.render('./listings/index.ejs', { allListing });
}

module.exports.renderNewForm = (req, res) => {
    res.render('./listings/newListing');
}

module.exports.viewDetailsListings = async (req, res) => {
    let id = req.params.id;
    const listing = await Listing.findById(id).populate({ path: 'reviews', populate: { path: "author" }, }).populate('owner');
    if (!listing) {
        req.flash('error', 'listing not found');
        return res.redirect('/listings');
    };
    console.log(listing);
    res.render('./listings/viewDetails', { listing });

};

module.exports.NewListingCreate = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;  // Note: fixed typo, should be req.file.filename
    // console.log(url, '..', filename);

    let newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;

    // Assign image object correctly
    newlisting.image = { url, filename };

    await newlisting.save();

    // Create flash message
    req.flash('success', 'Listing created successfully!');
    res.redirect('/listings');
}


module.exports.EditListings = async (req, res) => {
    let id = req.params.id;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'listing not found');
        return res.redirect('/listings');
    }
    res.render('./listings/editListing', { listing });
};

module.exports.updateListing = async (req, res) => {

    let id = req.params.id;

    // console.log(id);
    let updatelisting = await Listing.findByIdAndUpdate(id, req.body.listing);
    // console.log(updatelisting);
    if (typeof req.file !=='undefined') {
        let url = req.file.path;
        let filename = req.file.filename;
        updatelisting.image = { url, filename };
        await updatelisting.save();
        req.flash('success', 'Listing updated successfully!');
        res.redirect(`/listings/${id}`);
    }
};

module.exports.deletelistingcontroller = async (req, res) => {
    let id = req.params.id;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing Deleted successfully!');
    res.redirect('/listings');
    // res.send('listing deleted'); 
}