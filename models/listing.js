const mongoose = require("mongoose");
const Review = require("./review.js");
const { types, number, string, required } = require("joi");

// यहाँ Schema को define किया
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  image: { 
    filename: { type: String, default: null },
    url: { type: String, default: null },
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId, // Capital 'O'
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId, // Capital 'O'
    ref: "User",
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
});

// When a listing is deleted, remove its reviews too
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
