const User = require("../models/user-model");
const { sendSuccessResponse, sendErrorResponse } = require("../utils/sendJSONResponse");
const jwt = require('jsonwebtoken');



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



const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier) {
      return sendErrorResponse(res, 400, "Please provide email, username, or phone");
    }

    if (!password) {
      return sendErrorResponse(res, 400, "Please provide password");
    }

    const user = await User.findOne({
      $or: [
        { email: identifier },
        { username: identifier },
        { phone: identifier },
      ],
    });

    // 3. Check user + password
    if (!user || !(await user.comparePassword(password))) {
      return sendErrorResponse(res, 401, "Invalid credentials");
    }

    // 4. Generate token
    const token = user.generateToken();

    // 5. Response
    return sendSuccessResponse(res, 200, {
      message: "Login successful",
      doc: {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        token,
        createdAt: user.createdAt,
      },
    });

  } catch (error) {
    next(error);
  }
};


const logout = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendErrorResponse(res, 401, "Authorization required. Please login first.");
    }

    const token = authHeader.split(" ")[1];

    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return sendErrorResponse(res, 401, "Invalid or expired token. Please login again.");
    }

    // ✅ Logout success (client should remove token)
    return sendSuccessResponse(res, 200, {
      message: "Logged out successfully",
    });

  } catch (error) {
    next(error);
  }
};



module.exports = { register,login,logout };