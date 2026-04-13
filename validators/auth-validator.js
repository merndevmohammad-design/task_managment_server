const Joi = require("joi");

const registerSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(30).required(),

lastName: Joi.string().trim().min(2).max(30).allow("", null),
  username: Joi.string().trim().min(3).max(30).required(),

  email: Joi.string().email().required(),

  phone: Joi.string().min(10).max(15).required(),

  password: Joi.string().min(6).required(),

  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Passwords do not match",
    }),
    isAdmin: Joi.boolean().optional()
});

module.exports = { registerSchema };