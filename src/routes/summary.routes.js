import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getTotalHoursForADateRange, getTotalHoursPerProject } from "../controllers/summary.controller.js";
import { exportProjectSummariesInCsv } from "../utils/export.utils.js";

const router = Router();

/**
 * @swagger
 * /summary/getTotalHoursPerProject:
 *   get:
 *     summary: Get the total hours per project of user
 *     tags: [Summary]
 *     description: This endpoint allows user to get the total hours per project
 *     responses:
 *       200:
 *         description: Total Hours of each of user's projects retruved and calculated successfully
 *       500:
 *         description: Server error while calculating total hours of user's projects
 */
router.route("/getTotalHoursPerProject").get(verifyJWT, getTotalHoursPerProject);

/**
 * @swagger
 * /summary/getTotalHoursForADateRange:
 *   get:
 *     summary: Get the total hours for a specific date range
 *     tags: [Summary]
 *     description: This endpoint allows user to get the total hours for a specific date range
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date of the range (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date of the range (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Total Hours for a specific date range retrived and calculated successfully
 *       500:
 *         description: Server error while calculating total hours of user's date range
 */
router.route("/getTotalHoursForADateRange").get(verifyJWT, getTotalHoursForADateRange);

/**
 * @swagger
 * /summary/download/{projectId}/csv:
 *   get:
 *     summary: To export the Project summaries 
 *     tags: [Summary]
 *     description: This endpoint allows a user to download the project summaries in csv format
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         description: The ID of the project to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project summaries retrieved and downloaded successfully
 *       404:
 *         description: Project not found
 */
router.route("/download/:projectId/csv").get(verifyJWT, exportProjectSummariesInCsv)

export default router;