const joi = require("joi");

module.exports.listingSchema = joi.object({
    listing: joi.object({
      title: joi.string().required(),
      description: joi.string().required(),
      location: joi.string().required(),
      country: joi.string().required(),
      price: joi.number().required().min(0),
      image: joi.object({
        filename: joi.string().allow("", null),
        url: joi.string().allow("", null)
      }).allow(null).optional()
    }).required()
  });

// module.exports.listingSchema = joi.object({
//   listing: joi.object({
//     title: joi.string().required(),
//     description: joi.string().required(),
//     location: joi.string().required(),
//     country: joi.string().required(),
//     price: joi.number().required().min(0),
//     // Image validation temporarily removed
//   }).required()
// });

  

module.exports.reviewschema = joi.object({
    review : joi.object({
        rating: joi.number().required().min(1).max(5),
        comment: joi.string().required()
    }).required()
})