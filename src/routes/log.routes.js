import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteTimeLog, getAllLogsForAUser, getAllLogsOfAProject, startLogTime, stopLogTime, updateTimeLog } from "../controllers/log.controller.js";
import { logUpdateValidationRules, startLogValidationRules, stopLogValidationRules, validate } from "../validation/logValidation.js";

const router = Router();

router.route("/start").post(verifyJWT, startLogValidationRules(), validate, startLogTime);
router.route("/stop/:logId").post(verifyJWT, stopLogValidationRules(), validate, stopLogTime);

router.route("/updateLog/:logId").patch(verifyJWT, logUpdateValidationRules(), validate, updateTimeLog);

router.route("/deleteLog/:logId").delete(verifyJWT, deleteTimeLog);

router.route("/getAllLogsOfAProject/:projectId").get(verifyJWT, getAllLogsOfAProject)
router.route("/getAllLogsOfAUser").get(verifyJWT, getAllLogsForAUser)

export default router;