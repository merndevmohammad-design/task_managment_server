const { sendErrorResponse } = require("../utils/sendJSONResponse");

const validate = (schema) => (req, res, next) => {
  try {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessage = error.details.map((el) => el.message).join(", ");
      return sendErrorResponse(res, 400, errorMessage);
    }
    // Moves to the next middleware (the controller)
    next(); 
  } catch (err) {
    next(err);
  }
};

module.exports = validate;