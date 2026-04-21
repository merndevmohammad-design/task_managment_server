const jwt = require("jsonwebtoken");
const User = require("../models/user-model");
const { sendSuccessResponse, sendErrorResponse } = require("../utils/sendJSONResponse");
const saveBase64Image = require("../utils/saveBase64Image");


const myProfile = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendErrorResponse(res, 401, "Authorization required. Please login first.");
    }

    const token = authHeader.split(" ")[1];

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return sendErrorResponse(res, 401, "Invalid or expired token. Please login again.");
    }

    const userId = decoded.userId;

    if (!userId) {
      return sendErrorResponse(res, 401, "Unauthorized");
    }


    const user = await User.findById(userId).select("-password");

    if (!user) {
      return sendErrorResponse(res, 404, "User not found");
    }


    return sendSuccessResponse(res, 200, {
      message: "Profile fetched successfully",
      doc: user,
    });

  } catch (error) {
    next(error);
  }
};



const updateProfileImage = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendErrorResponse(res, 401, "Authorization required. Please login first.");
    }

    const token = authHeader.split(" ")[1];

    let decoded;

    // 2. Verify token
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return sendErrorResponse(res, 401, "Invalid or expired token.");
    }

    // 3. Get userId
    const userId = decoded.userId;

    if (!userId) {
      return sendErrorResponse(res, 401, "Unauthorized");
    }

    // 4. Get image from body
    const { imageDataURI } = req.body;

    if (!imageDataURI) {
      return sendErrorResponse(res, 400, "Image is required");
    }

    // 5. Convert base64 → file
    const image = saveBase64Image(imageDataURI);

    // 6. Update DB
    const user = await User.findByIdAndUpdate(
      userId,
      {
        image: {
          mediaType: image.mediaType,
          relativeAddress: image.filePath,
        },
      },
      { new: true }
    ).select("-password");

    if (!user) {
      return sendErrorResponse(res, 404, "User not found");
    }

    // 7. Success response
    return sendSuccessResponse(res, 200, {
      message: "Image uploaded successfully",
      doc: user,
    });

  } catch (error) {
    next(error);
  }
};



module.exports = { myProfile, updateProfileImage };
