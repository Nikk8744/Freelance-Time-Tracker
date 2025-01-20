import { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { Project } from "../models/project.model.js";
import { Task } from "../models/task.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Log } from "../models/log.model.js";

const createTask = async (req, res, next) => {
    // take projectID, subject
    // description, checklist are optional
    const { projectId } = req.params;
    if (!isValidObjectId) {
        throw new ApiError(400, "Invalid Project ID")
    }

    const { subject, description, checklist, dueDate } = req.body;
    if (!subject || description) {
        throw new ApiError(400, "Subject is required")
    };

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            throw new ApiError(404, "Project not found")
        };

        if (!req.user || !req.user._id) {
            throw new ApiError(401, "Unauthorized access");
        }

        if (!project.members.includes(req.user?._id) && project.owner?.toString() !== req.user?._id.toString()) {
            throw new ApiError(403, "You are not a member of this project")
        }

        const task = await Task.create({
            subject,
            description,
            checklist,
            project: projectId,
            assignedUser: req.user?._id,
            dueDate: dueDate ? new Date(dueDate) : new Date(),
        });
        if (!task) {
            throw new ApiError(500, "Failed to create task")
        };
    
        return res.status(201).json(
            new ApiResponse(200, {Your_Tasks: task}, "Task created successfully :)")
        );
    } catch (error) {
        // throw new ApiError(500, "Internal Server Error while creating task!!", error);
        next(error)
    };
};

const updateTask = async (req, res) => {
    const { taskId } = req.params;
    if (!isValidObjectId(taskId)) {
        throw new ApiError(400, "Invalid Task ID")
    }

    const { subject, description, status, dueDate } = req.body;

    try {
        const task = await Task.findById(taskId);
        if (!task) {
            throw new ApiError(404, "Task not found")
        }

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            {
                $set: {
                    subject,
                    description,
                    status,
                    dueDate,
                },
            },
            { new: true }
        );
        if (!updatedTask) {
            throw new ApiError(500, "Failed to update task");
        }

        return res.status(200).json(
            new ApiResponse(200, updatedTask, "Task updated successfully :)")
        );
    } catch (error) {
        throw new ApiError(500, "Internal Server Error while updating task!!");
    }
}

const deleteTask = async (req, res) => {
    const { taskId } = req.params;
    if(!isValidObjectId(taskId)){
        throw new ApiError(400, "Invalid Task ID")
    };

    try {
        const deletedTask = await Task.findByIdAndDelete(taskId);
        if (!deletedTask) {
            throw new ApiError(404, "Task not found and coudn`t be deleted");
        }
    
        return res.status(200).json(
            new ApiResponse(200, deletedTask, "Task deleted successfully :)")
        );
    } catch (error) {
        throw new ApiError(500, "Internal Server Error while deleting task!!");
    }
};

const getProjectTasks = async (req, res) => {
    const { projectId } = req.params; 
    if(!isValidObjectId(projectId)){
        throw new ApiError(400, "Invalid Project ID")
    }

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            throw new ApiError(404, "Project not found");
        }

        const tasks = await Task.find({project: projectId}).populate("project").populate("assignedUser");
        if(!tasks){
            throw new ApiError(404, "No tasks found for this project");
        }

        return res.status(200).json(
            new ApiResponse(200, tasks, "Tasks for project found successfully :)")
        )
    } catch (error) {
        throw new ApiError(500, "Internal Server Error while getting project tasks!!");
    }
};

const getAllTasks = async (req, res) => {

    try {
        const allTasks = await Task.find().populate("project").populate("assignedUser")
        if(!allTasks || allTasks.length === 0){
            throw new ApiError(404, "No tasks found");
        }
        
        return res.status(200).json(
            new ApiResponse(200, allTasks, "Tasks retrieved successfully :)")
        )
    } catch (error) {
        throw new ApiError(500, "Internal Server Error while getting all tasks!!");
    }
}

const addLogsToTask = async (req, res) => {
    const { logId, taskId } = req.params;
    if (!isValidObjectId(logId) || !isValidObjectId(taskId)) {
        throw new ApiError(400, "Invalid Log ID or Task ID");
    }

    try {
        const log = await Log.findById(logId);
        const task = await Task.findById(taskId);
        if(!log || !task){
            throw new ApiError(404, "Log or Task not found");
        }

        log.task = task._id;
        await log.save();

        return res.status(200).json(
            new ApiResponse(200, log, "Log added to task successfully :)")
        )

    } catch (error) {
        throw new ApiError(500, "Internal Server Error while adding logs to task!!");
    }
}

const addChecklistItem = async (req, res) => {
    const { taskId } = req.params;
    const { item } = req.body;
    if(!isValidObjectId(taskId)){
        throw new ApiError(400, "Invalid Task ID")
    }
    if(!item){
        throw new ApiError(400, "Checklist item is required");
    }

    try {
        const task = await Task.findById(taskId);
        if (!task) {
            throw new ApiError(404, "Task not found");
        }

        task.checklist.push({item, isCompleted: false})
        await task.save();

        return res.status(200).json(
            new ApiResponse(200, task, "Checklist item added successfully :)")
        );
    } catch (error) {
        throw new ApiError(500, "Internal Server Error while adding checklist item!!");
    }
};

const updateChecklistItem = async (req, res) => {
    // get the taskID and item id
    // no need to get the isCompleted status as it is boolean we will directly set it to false in logic
    // then return
    
    const { taskId, itemId } = req.params;
    if (!isValidObjectId(taskId) || !isValidObjectId(itemId)) {
        throw new ApiError(400, "Invalid Task ID or Checklist Item ID");
    }
    
    try {
        const task = await Task.findById(taskId)
        if (!task) {
            throw new ApiError(404, "Task not found");
        }

        const checklistItem = task.checklist.id(itemId)
        if (!checklistItem) {
            throw new ApiError(404, "Checklist item not found");
        }
        checklistItem.isCompleted = !checklistItem.isCompleted
        await task.save();

        return res.status(200).json(
            new ApiResponse(200, task, "Checklist item status updated successfully :)")
        )

    } catch (error) {
        throw new ApiError(500, "Internal Server Error while updating checklist item!!");
    }
};

// const getTasksForAProject = async (req, res) => {
//     const { projectId } = req.params;
//     if (!isValidObjectId(projectId)) {
//         throw new ApiError(400, "Invalid Project ID");
//     }

//     try {
//         const project = await Project.findById(projectId);
//         if (!project) {
//             throw new ApiError(404, "Project not found");
//         }

//         const tasksOfProject = await Task.find({ project: projectId }).sort({ createdAt: -1 }).populate("assignedUser").populate("project");
//         if(!tasksOfProject){
//             throw new ApiError(404, "No tasks found for this project");
//         }

//         return res.status(200).json(
//             new ApiResponse(200, tasksOfProject, "Tasks for the project fetched successfully :)")
//         );

//     } catch (error) {
//         throw new ApiError(500, "Internal Server Error while getting tasks for a project!!");
//     }
// }

const getTaskById = async (req, res) => {
   
        const { taskId } = req.params;  
        if (!isValidObjectId(taskId)) {
            throw new ApiError(400, "Invalid Task ID");
        }
        try {
          // Find task by taskId in the database
          const task = await Task.findById(taskId);
      
          if (!task) {
            throw new ApiError(404, "Task not found");
          }
      
          // Return the task as response
          return res.status(200).json(
            new ApiResponse(200, task, "Task fetched successfully :)")
          )

        } catch (error) {
            throw new ApiError(500, "Internal Server Error while getting task by id!!");
        }
};

const getAllTasksOfUser = async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }
    if(!isValidObjectId(userId)){
        throw new ApiError(401, "Invalid User Id");
    }

    const tasksOfUser = await Task.find({assignedUser: userId}).sort({ createdAt: -1})
                            //   .populate("assignedUser").populate("project");
    if(!tasksOfUser){
        throw new ApiError(404, "No tasks found for this user");
    }
    
    return res.status(200).json(
        new ApiResponse(200, tasksOfUser, "Tasks for the user fetched successfully :)")
    )
}

export {
    createTask,
    updateTask,
    deleteTask,
    getProjectTasks,
    getAllTasks,
    addLogsToTask,
    addChecklistItem,
    updateChecklistItem,
    // getTasksForAProject,
    getTaskById,
    getAllTasksOfUser,
}