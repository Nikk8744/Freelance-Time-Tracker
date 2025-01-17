import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addChecklistItem, createTask, deleteTask, getAllTasks, getProjectTasks, getTaskById, updateChecklistItem, updateTask } from "../controllers/task.controller.js";

const router = Router();

/**
 * @swagger
 * /task/createTask/{projectId}:
 *   post:
 *     summary: Create a new task for a project
 *     tags: [Tasks]
 *     description: This endpoint allows a user to create a new task within a specific project.
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         description: The ID of the project where the task will be created.
 *         schema:
 *           type: string
 *           format: ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - description
 *             properties:
 *               subject:
 *                 type: string
 *                 description: The title of the task.
 *               description:
 *                 type: string
 *                 description: The description of the task.
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 description: The due date of the task.
 *     responses:
 *       200:
 *         description: Task created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 taskId:
 *                   type: string
 *                   format: ObjectId
 *                   description: The ID of the created task.
 *                 msg:
 *                   type: string
 *                   description: Success message
 *       400:
 *         description: Bad request (missing parameters or invalid data).
 *       500:
 *         description: Server error.
 */
router.route('/createTask/:projectId').post(verifyJWT, createTask);

/**
 * @swagger
 * /task/updateTask/{taskId}:
 *   patch:
 *     summary: Update an existing task
 *     tags: [Tasks]
 *     description: This endpoint allows a user to update an existing task by providing a taskId.
 *     parameters:
 *       - name: taskId
 *         in: path
 *         required: true
 *         description: The ID of the task to be updated.
 *         schema:
 *           type: string
 *           format: ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The updated title of the task.
 *               description:
 *                 type: string
 *                 description: The updated description of the task.
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 description: The updated due date of the task.
 *     responses:
 *       200:
 *         description: Task updated successfully.
 *       400:
 *         description: Bad request (validation errors).
 *       404:
 *         description: Task not found.
 *       500:
 *         description: Server error.
 */
router.route('/updateTask/:taskId').patch(verifyJWT, updateTask);

/**
 * @swagger
 * /task/deleteTask/{taskId}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     description: This endpoint allows a user to delete a task by providing a taskId.
 *     parameters:
 *       - name: taskId
 *         in: path
 *         required: true
 *         description: The ID of the task to be deleted.
 *         schema:
 *           type: string
 *           format: ObjectId
 *     responses:
 *       200:
 *         description: Task deleted successfully.
 *       404:
 *         description: Task not found.
 *       500:
 *         description: Server error.
 */
router.route('/deleteTask/:taskId').delete(verifyJWT, deleteTask);

/**
 * @swagger
 * /task/getProjectTasks/{projectId}:
 *   get:
 *     summary: Get all tasks for a project
 *     tags: [Tasks]
 *     description: This endpoint allows a user to retrieve all tasks for a specific project.
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         description: The ID of the project to get tasks for.
 *         schema:
 *           type: string
 *           format: ObjectId
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   taskId:
 *                     type: string
 *                     format: ObjectId
 *                     description: The ID of the task.
 *                   title:
 *                     type: string
 *                     description: The title of the task.
 *                   description:
 *                     type: string
 *                     description: The description of the task.
 *                   dueDate:
 *                     type: string
 *                     format: date
 *                     description: The due date of the task.
 *       404:
 *         description: Project not found.
 *       500:
 *         description: Server error.
 */
router.route ('/getProjectTasks/:projectId').get(verifyJWT, getProjectTasks);


/**
 * @swagger
 * /task/getAllTasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     description: This endpoint allows a user to retrieve all tasks in the system.
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   taskId:
 *                     type: string
 *                     format: ObjectId
 *                     description: The ID of the task.
 *                   title:
 *                     type: string
 *                     description: The title of the task.
 *                   description:
 *                     type: string
 *                     description: The description of the task.
 *                   dueDate:
 *                     type: string
 *                     format: date
 *                     description: The due date of the task.
 *       500:
 *         description: Server error.
 */
router.route ('/getAllTasks').get(verifyJWT, getAllTasks);

/**
 * @swagger
 * /task/addChecklistItem/{taskId}:
 *   patch:
 *     summary: Add a checklist item to a task
 *     tags: [Tasks]
 *     description: This endpoint allows a user to add a checklist item to a specific task.
 *     parameters:
 *       - name: taskId
 *         in: path
 *         required: true
 *         description: The ID of the task to add the checklist item to.
 *         schema:
 *           type: string
 *           format: ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - item
 *             properties:
 *               item:
 *                 type: string
 *                 description: The checklist item to be added to the task.
 *     responses:
 *       200:
 *         description: Checklist item added successfully.
 *       404:
 *         description: Task not found.
 *       500:
 *         description: Server error.
 */
router.route('/addChecklistItem/:taskId').patch(verifyJWT, addChecklistItem); // here post also works


/**
 * @swagger
 * /task/updateChecklistItem/task/{taskId}/item/{itemId}:
 *   patch:
 *     summary: Update a checklist item for a task
 *     tags: [Tasks]
 *     description: This endpoint allows a user to update a checklist item for a specific task.
 *     parameters:
 *       - name: taskId
 *         in: path
 *         required: true
 *         description: The ID of the task that the checklist item belongs to.
 *         schema:
 *           type: string
 *           format: ObjectId
 *       - name: itemId
 *         in: path
 *         required: true
 *         description: The ID of the checklist item to update.
 *         schema:
 *           type: string
 *           format: ObjectId
 *     responses:
 *       200:
 *         description: Checklist item updated successfully.
 *       404:
 *         description: Task or checklist item not found.
 *       500:
 *         description: Server error.
 */
router.route('/updateChecklistItem/task/:taskId/item/:itemId').patch(verifyJWT, updateChecklistItem); 

// router.route('/allTasksOfAProject/:projectId').get(verifyJWT, )

/**
 * @swagger
 * /task/getTaskById/{taskId}:
 *   get:
 *     summary: Get specific task details
 *     tags: [Tasks]
 *     description: This endpoint allows a user to fetch the details of a task by its ID.
 *     parameters:
 *       - name: taskId
 *         in: path
 *         required: true
 *         description: The ID of the task to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task details retrieved successfully
 *       404:
 *         description: Task not found
 */
router.route('/getTaskById/:taskId').get(verifyJWT, getTaskById)


export default router;