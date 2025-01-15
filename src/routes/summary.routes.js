import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getTotalHoursForADateRange, getTotalHoursPerProject } from "../controllers/summary.controller.js";

const router = Router();

router.route("/getTotalHoursPerProject").get(verifyJWT, getTotalHoursPerProject);
router.route("/getTotalHoursForADateRange").get(verifyJWT, getTotalHoursForADateRange);


export default router;