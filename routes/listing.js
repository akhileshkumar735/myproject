const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listing = require('../models/listing.js');
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


router.route("/")
.get( wrapAsync(listingController.index))
// .post(validateListing,isLoggedIn, wrapAsync(listingController.createListing));
.post(upload.single("listing[image]"), 
(req, res, next) => {
    // Add image data manually to req.body for Joi validation
    if (req.file) {
        req.body.listing.image = {
            filename: req.file.filename,
            url: req.file.path
        };
    } else {
        req.body.listing.image = {};  // Handle empty image scenario
    }
    next();
},
isLoggedIn, 
validateListing,
wrapAsync(listingController.createListing)
);  

// new route
router.get(
    "/new" , isLoggedIn,listingController.renderNewForm);


router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    (req, res, next) => {
        if (req.file) {
            req.body.listing.image = {
                filename: req.file.filename,
                url: req.file.path
            };
        }
        next();
    },
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  
.delete(isLoggedIn ,isOwner,wrapAsync(listingController.deleteListing));

// edit route
router.get(
    "/:id/edit" ,isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;