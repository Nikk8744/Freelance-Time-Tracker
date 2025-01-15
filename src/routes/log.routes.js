import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteTimeLog, getAllLogsForAUser, getAllLogsOfAProject, startLogTime, stopLogTime, updateTimeLog } from "../controllers/log.controller.js";

const router = Router();

router.route("/start").post(verifyJWT, startLogTime);
router.route("/stop/:logId").post(verifyJWT, stopLogTime);

router.route("/updateLog/:logId").patch(verifyJWT, updateTimeLog);

router.route("/deleteLog/:logId").delete(verifyJWT, deleteTimeLog);

router.route("/getAllLogsOfAProject/:projectId").get(verifyJWT, getAllLogsOfAProject)
router.route("/getAllLogsOfAUser").get(verifyJWT, getAllLogsForAUser)

export default router;