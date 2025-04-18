const listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req,res) =>{
    let newReview = new Review(req.body.review);
    let foundListing = await listing.findById(req.params.id); // ✅ Model name capitalized
        newReview.author = req.user._id;
   foundListing.reviews.push(newReview);

   await newReview.save();
   await foundListing.save();
   req.flash("success", "New review created");
  res.redirect(`/listings/${foundListing._id}`);

};


module.exports.deleteReview = async(req,res) =>{
    let {id,reviewId} = req.params;

    await listing.findByIdAndUpdate(id, {pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", " review deleted");
    res.redirect(`/listings/${id}`);
};