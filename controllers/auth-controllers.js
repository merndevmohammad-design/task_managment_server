const User = require("../models/user-model");
const { sendSuccessResponse, sendErrorResponse } = require("../utils/sendJSONResponse");



const register = async (req, res, next) => {
  try {
    const { firstName, lastName, username, email, phone, password, isAdmin} = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return sendErrorResponse(res, 400, "Email already exists");
    }

    const usernameExist = await User.findOne({ username });
    if (usernameExist) {
      return sendErrorResponse(res, 400, "Username already exists");
    }

    const newUser = await User.create({
      firstName,
      lastName,
      username,
      email,
      phone,
      password,
      isAdmin,
    });

    const token = newUser.generateToken();

    return sendSuccessResponse(res, 201, {
      message: "Account created successfully",
      doc: {
        id: newUser._id.toString(),
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
        isAdmin: newUser.isAdmin,
        token: token,
        createdAt: newUser.createdAt,
      },
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { register };