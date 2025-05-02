const Joi = require('joi');

// Joi schema for registration
const userSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

// Joi schema for login
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

const userValidation = (req, res, next) => {
    const { error } = userSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            success: false,
            message: "Validation Error",
            errors: error.details.map(e => e.message)
        });
    }
    next();
};

const loginValidation = (req, res, next) => {
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            success: false,
            message: "Validation Error",
            errors: error.details.map(e => e.message)
        });
    }
    next();
};

module.exports = { userValidation, loginValidation };
