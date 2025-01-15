import { Router } from "express";
import { loginUser, logOutUser, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { userValidationRules, validate } from "../validation/userValidation.js";

const router = Router();

router.route('/register').post(userValidationRules(), validate, registerUser)
router.route('/login').post(loginUser)

router.route("/logout").post(verifyJWT, logOutUser)

export default router;