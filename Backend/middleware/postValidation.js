const Joi = require('joi');

/**
 * Joi schema for validating create post request
 */
const postValidationSchema = Joi.object({
    user_id: Joi.string().required(), // Assuming user_id is passed in the request body
  type: Joi.string().valid('donate', 'request').required(),
  description: Joi.string().required(),
  quantity: Joi.string().required(),
  expiry_date: Joi.date().iso().greater('now').required(),
  pickup_location: Joi.object({
    address: Joi.string(),
    coordinates: Joi.object({
      lat: Joi.number().required(),
      long: Joi.number().required()
    }).or('lat', 'long')
  }).custom((value, helpers) => {
    const hasAddress = !!value.address;
    const hasCoordinates = value.coordinates && typeof value.coordinates.lat === 'number' && typeof value.coordinates.long === 'number';

    if (!hasAddress && !hasCoordinates) {
      return helpers.error('any.invalid');
    }
    return value;
  }, 'Custom pickup_location validation').required()
});

/**
 * Middleware for validating post creation request
 */
const validatePost = (req, res, next) => {
 // Add user_id to the request body

    req.body.user_id = req.user_id; // Assuming req.user is set by authentication middleware
  const { error } = postValidationSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ message: "Validation Error", errors: error.details.map(d => d.message) });
  }
  next();
};

module.exports = { validatePost };
