import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { startLogTime, stopLogTime } from "../controllers/log.controller.js";

const router = Router();

router.route("/start").post(verifyJWT, startLogTime);
router.route("/stop/:logId").post(verifyJWT, stopLogTime);

export default router;