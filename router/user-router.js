const express = require("express");
const router = express.Router();
const usercontrollers = require("../controllers/user-controllers");
const validate = require("../middlewares/validate-middleware");
const protect = require("../middlewares/error-middleware");
const {updateProfileImageSchema } = require("../validators/profile-validator");




 router
  .route("/my-profile")
  .get(protect, usercontrollers.myProfile);



router.route("/profile/image").patch(
  validate(updateProfileImageSchema), 
  usercontrollers.updateProfileImage
);




module.exports = router;