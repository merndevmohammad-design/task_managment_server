const express = require("express");
const router = express.Router();
const authcontrollers = require("../controllers/auth-controllers");
const validate = require("../middlewares/validate-middleware");
const { registerSchema,loginSchema } = require("../validators/auth-validator");
const protect = require("../middlewares/error-middleware");


router.route("/register").post(validate(registerSchema), authcontrollers.register);
router
  .route("/login")
  .post(validate(loginSchema), authcontrollers.login);
 router
  .route("/logout")
  .post(protect, authcontrollers.logout);

module.exports = router;