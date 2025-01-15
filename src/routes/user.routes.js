import { Router } from "express";
import { loginUser, logOutUser, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { userLoginValidationRules, userValidationRules, validate } from "../validation/userValidation.js";

const router = Router();

router.route('/register').post(userValidationRules(), validate, registerUser)
router.route('/login').post(userLoginValidationRules(), validate, loginUser)

router.route("/logout").post(verifyJWT, logOutUser)

export default router;