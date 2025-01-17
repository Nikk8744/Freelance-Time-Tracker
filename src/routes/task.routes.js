import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addChecklistItem, createTask, deleteTask, getAllTasks, getProjectTasks, updateChecklistItem, updateTask } from "../controllers/task.controller.js";

const router = Router();

router.route('/createTask/:projectId').post(verifyJWT, createTask);

router.route('/updateTask/:taskId').patch(verifyJWT, updateTask);

router.route('/deleteTask/:taskId').delete(verifyJWT, deleteTask);


router.route ('/getProjectTasks/:projectId').get(verifyJWT, getProjectTasks);
router.route ('/getAllTasks').get(verifyJWT, getAllTasks);
 
router.route('/addChecklistItem/:taskId').patch(verifyJWT, addChecklistItem); // here post also works

router.route('/updateChecklistItem/task/:taskId/item/:itemId').patch(verifyJWT, updateChecklistItem); 

// router.route('/allTasksOfAProject/:projectId').get(verifyJWT, )


export default router;