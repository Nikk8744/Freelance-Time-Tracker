import { Router } from "express";
import { createProject, deleteProject, getAllProjects, getAllProjectsOfAUser, getProjectById, updateProject } from "../controllers/project.controller.js";
import { isAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import { projectUpdateValidationRules, projectValidationRules, validate } from "../validation/projectValidation.js";

const router = Router();

router.route("/createProject").post(verifyJWT, projectValidationRules(), validate, createProject);

router.route("/getProjectById/:projectId").get(verifyJWT, getProjectById);
router.route("/getProjectsOfAUser").get(verifyJWT, getAllProjectsOfAUser);

router.route("/getAllProjects").get(verifyJWT, isAdmin, getAllProjects);
router.route("/updateProject/:projectId").patch(verifyJWT, projectUpdateValidationRules(),validate, updateProject);

router.route("/deleteProject/:projectId").delete(verifyJWT, deleteProject);

export default router;