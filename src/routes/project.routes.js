import { Router } from "express";
import { createProject, deleteProject, getAllProjects, getAllProjectsOfAUser, getProjectById, updateProject } from "../controllers/project.controller.js";
import { isAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import { projectUpdateValidationRules, projectValidationRules, validate } from "../validation/projectValidation.js";

const router = Router();

/**
 * @swagger
 * /project/createProject:
 *   post:
 *     summary: Create a new project
 *     tags: [Project]
 *     description: This endpoint allows a user to create a new project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - startDate
 *               - endDate
 *             properties: 
 *               name:
 *                 type: string
 *                 description: The name of the project
 *               description:
 *                 type: string
 *                 description: The description of the project
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: The start date of the project
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: The end date of the project
 *     responses:
 *       200:
 *         description: Project created successfully
 *       400:
 *         description: Something went wrong while creating the project
 *       500:
 *         description: Something went wrong with the server    
 */
router.route("/createProject").post(verifyJWT, projectValidationRules(), validate, createProject);

/**
 * @swagger
 * /project/getProjectById/{id}:
 *   get:
 *     summary: Get project details
 *     tags: [Project]
 *     description: This endpoint allows a user to fetch the details of a project by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the project to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project details retrieved successfully
 *       404:
 *         description: Project not found
 */
router.route("/getProjectById/:projectId").get(verifyJWT, getProjectById);

/**
 * @swagger
 * /project/getProjectsOfAUser:
 *   get:
 *     summary: Get all projects of the current user
 *     tags: [Project]
 *     description: This endpoint fetches all projects belonging to the authenticated user.
 *     responses:
 *       200:
 *         description: Projects retrieved successfully
 *       404:
 *         description: No projects found for this user
 *       500:
 *         description: Server error
 */
router.route("/getProjectsOfAUser").get(verifyJWT, getAllProjectsOfAUser);

/**
 * @swagger
 * /project/getAllProjects:
 *   get:
 *     summary: Get all projects (Admin only)
 *     tags: [Project]
 *     description: This endpoint retrieves all projects. Only accessible by admin users.
 *     responses:
 *       200:
 *         description: All projects retrieved successfully
 *       404:
 *         description: No projects found
 *       500:
 *         description: Server error
 */
router.route("/getAllProjects").get(verifyJWT, isAdmin, getAllProjects);

/**
 * @swagger
 * /project/updateProject/{projectId}:
 *   patch:
 *     summary: Update a project by ID
 *     tags: [Project]
 *     description: This endpoint allows a user to update project details by its ID.
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         description: The ID of the project to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The updated name of the project
 *               description:
 *                 type: string
 *                 description: The updated description of the project
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: The updated start date of the project
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: The updated end date of the project
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       400:
 *         description: Invalid data in the request
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.route("/updateProject/:projectId").patch(verifyJWT, projectUpdateValidationRules(),validate, updateProject);

/**
 * @swagger
 * /project/deleteProject/{projectId}:
 *   delete:
 *     summary: Delete a project by ID
 *     tags: [Project]
 *     description: This endpoint allows a user to delete a project by its ID.
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         description: The ID of the project to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.route("/deleteProject/:projectId").delete(verifyJWT, deleteProject);

export default router;