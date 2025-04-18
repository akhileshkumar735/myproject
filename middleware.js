const Listing = require("./models/listing"); 
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewschema} = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // 🔥 Save the original URL before redirecting to login
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to continue");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        
    }
    next();
};

module.exports.isOwner =async(req,res,next) =>{
    let {id}= req.params;
    let foundlisting = await Listing.findById(id);
    if(!foundlisting.owner._id.equals(res.locals.curruser._id)) {
        req.flash("error", "you are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


module.exports.validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewschema.validate(req.body);
    if (error) {
      const errMsg = error.details.map((el) => el.message).join(', ');
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };

  
module.exports.isReviewAuthor =async(req,res,next) =>{
    let {reviewId,id}= req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.curruser._id)) {
        req.flash("error", "you are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
