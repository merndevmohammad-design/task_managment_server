const express = require("express");
const router = express.Router();
const authcontrollers = require("../controllers/auth-controllers");
const validate = require("../middlewares/validate-middleware");
const { registerSchema } = require("../validators/auth-validator");

router.route("/register").post(validate(registerSchema), authcontrollers.register);

module.exports = router;