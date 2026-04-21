const Joi = require("joi");

const updateProfileImageSchema = Joi.object({
  imageDataURI: Joi.string()
    .pattern(/^data:image\/(jpeg|png|jpg);base64,/)
    .required()
    .messages({
      "string.pattern.base": "Invalid base64 image format",
      "any.required": "Image is required",
    }),
});

module.exports = {
  updateProfileImageSchema,
};