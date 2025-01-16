import { Router } from "express";
import { loginUser, logOutUser, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { userLoginValidationRules, userValidationRules, validate } from "../validation/userValidation.js";

const router = Router();

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     description: This endpoint allows a new user to register by providing required data.
 *     requestBody:
 *       required: true
 *       content: 
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *               - name
 *               - userName
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of user
 *               userName:
 *                 type: string
 *                 description: The username of new user
 *               email: 
 *                 type: string
 *                 description: The email address of the new user
 *               password:
 *                 type: string
 *                 description: The password for the new user
 *               role: 
 *                 type: string
 *                 description: The role of the user
 *     responses: 
 *         201:
 *             description: User registered successfully
 *         400:
 *             description: Bad request (validation errors)
 */
router.route('/register').post(userValidationRules(), validate, registerUser)

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login a user
 *     tags: [User]
 *     description: This endpoint allows an existing user to login by providing their credentials (email and password).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               userName:
 *                 type: string
 *                 description: The username of user
 *               email: 
 *                 type: string
 *                 description: The email address of the user
 *               password:
 *                 type: string
 *                 description: The password of user
 *     responses: 
 *       200:
 *         description: User logged in successfully
 *       400: 
 *         description: Bad request (validation errors)
 *       401:
 *         description: Unauthorized (invalid credentials)
 */
router.route('/login').post(userLoginValidationRules(), validate, loginUser)


/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Logout the current user
 *     tags: [User]
 *     description: This endpoint allows the current user to logout.
 *     security: 
 *       - bearerAuth: [] # This is the auth mechanism you're using, for example JWT Bearer Token
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized (not logged in)
 */
router.route("/logout").post(verifyJWT, logOutUser)

export default router;