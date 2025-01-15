import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getTotalHoursForADateRange, getTotalHoursPerProject } from "../controllers/summary.controller.js";
import { exportProjectSummariesInCsv } from "../utils/export.utils.js";

const router = Router();

router.route("/getTotalHoursPerProject").get(verifyJWT, getTotalHoursPerProject);
router.route("/getTotalHoursForADateRange").get(verifyJWT, getTotalHoursForADateRange);

router.route("/download/:projectId/csv").get(verifyJWT, exportProjectSummariesInCsv)

export default router;