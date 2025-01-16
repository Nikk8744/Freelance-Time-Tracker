import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteTimeLog, getAllLogsForAUser, getAllLogsOfAProject, startLogTime, stopLogTime, updateTimeLog } from "../controllers/log.controller.js";
import { logUpdateValidationRules, startLogValidationRules, stopLogValidationRules, validate } from "../validation/logValidation.js";

const router = Router();

/**
 * @swagger
 * /logs/start/{projectId}:
 *   post:
 *     summary: Start a log time
 *     tags: [Logs]
 *     description: This endpoint allows a logged in user to start a log time for a project.
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         description: The ID of the project to the start log 
 *         schema:
 *           type: string 
 *     responses:
 *       200:
 *         description: Time logging started successfully
 *       400:
 *         description: Bad request (validation errors)
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.route("/start/:projectId").post(verifyJWT, startLogValidationRules(), validate, startLogTime);

/**
 * @swagger
 * /logs/stop/{logId}:
 *   post:
 *     summary: Stop logging time for a project
 *     tags: [Logs]
 *     description: This endpoint allows a user to stop logging time for a specific log entry.
 *     parameters:
 *       - name: logId
 *         in: path
 *         required: true
 *         description: The log ID to stop the time for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Time logging stopped successfully
 *       400:
 *         description: Bad request (validation errors)
 *       404:
 *         description: Log not found
 *       500:
 *         description: Server error
 */
router.route("/stop/:logId").post(verifyJWT, stopLogValidationRules(), validate, stopLogTime);

/**
 * @swagger
 * /logs/updateLog/{logId}:
 *   patch:
 *     summary: Update a time log entry
 *     tags: [Logs]
 *     description: This endpoint allows a user to update an existing time log entry.
 *     parameters:
 *       - name: logId
 *         in: path
 *         required: true
 *         description: The ID of the log entry to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: The updated description of the time log entry.
 *               hoursWorked:
 *                 type: number
 *                 format: float
 *                 description: The updated number of hours worked.
 *     responses:
 *       200:
 *         description: Time log updated successfully
 *       400:
 *         description: Invalid data (validation errors)
 *       404:
 *         description: Log not found
 *       500:
 *         description: Server error
 */
router.route("/updateLog/:logId").patch(verifyJWT, logUpdateValidationRules(), validate, updateTimeLog);

/**
 * @swagger
 * /logs/deleteLog/{logId}:
 *   delete:
 *     summary: Delete a time log entry
 *     tags: [Logs]
 *     description: This endpoint allows a user to delete a specific time log entry by its ID.
 *     parameters:
 *       - name: logId
 *         in: path
 *         required: true
 *         description: The ID of the log entry to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Time log deleted successfully
 *       404:
 *         description: Log not found
 *       500:
 *         description: Server error
 */
router.route("/deleteLog/:logId").delete(verifyJWT, deleteTimeLog);

/**
 * @swagger
 * /logs/getAllLogsOfAProject/{projectId}:
 *   get:
 *     summary: Get all logs for a project
 *     tags: [Logs]
 *     description: This endpoint allows a user to get all the time logs for a specific project.
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         description: The ID of the project to retrieve logs for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Logs retrieved successfully
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.route("/getAllLogsOfAProject/:projectId").get(verifyJWT, getAllLogsOfAProject)

/**
 * @swagger
 * /logs/getAllLogsOfAUser:
 *   get:
 *     summary: Get all logs for a user
 *     tags: [Logs]
 *     description: This endpoint allows a user to get all their own time logs.
 *     responses:
 *       200:
 *         description: Logs retrieved successfully
 *       500:
 *         description: Server error
 */
router.route("/getAllLogsOfAUser").get(verifyJWT, getAllLogsForAUser)

export default router;