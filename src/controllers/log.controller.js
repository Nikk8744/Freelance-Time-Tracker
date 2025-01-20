import { isValidObjectId } from "mongoose";
import { Project } from "../models/project.model.js";
import { Log } from "../models/log.model.js";
import { ApiError } from "../utils/ApiError.js";
import { Task } from "../models/task.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const startLogTime = async (req, res) => {
    const userId = req.user?._id;
    const { projectId } = req.params;

    if(!isValidObjectId(projectId)){
        // return res.status(400).json({msg: "Invalid project ID"});
        throw new ApiError(400, "Invalid project ID");
    }

    const project = await Project.findById(projectId);
    if(!project){
        // return res.status(404).json({ msg: "Project not found!!"});
        throw new ApiError(404, "Project not found");
    }

    const newLog = await Log.create({
        userId: userId,
        projectId: projectId,
        startTimeOfLog: new Date(),
        endTimeOfLog: null,
        timeSpent: 0,
    });
    if (!newLog) {
        // return res.status(401).json({msg: "Something went wrong while creating the log"});
        throw new ApiError(401, "Something went wrong while creating the log");
    }

    // to update the project.logs array
    project.logs.push(newLog?._id);
    await project.save();

    return res.status(200).json(
        // {newLog, msg: "Log started successfully!!"}
        new ApiResponse(200, newLog, "Log started successfully!!")
    );
};

const stopLogTime = async (req, res) => {
    const { logId, taskId } = req.params;
    const { name, description } = req.body;

    if(!isValidObjectId(logId)){
        // return res.status(400).json({ msg: "Invalid LogId"});
        throw new ApiError(400, "Invalid LogId");
    }
    if(!name || !description){
        // return res.status(401).json({msg: "Broo name and description are required while stopping the timer brother!!"});
        throw new ApiError(401, "Broo name and description are required while stopping the timer brother!!");
    }

    const log = await Log.findById(logId);
    if (!log) {
        // return res.status(404).json({ msg: "Log Not Found"});
        throw new ApiError(404, "Log Not Found");
    }
    if(log.endTimeOfLog){
        // return res.status(400).json({ msg: "Log has already stopped!"});
        throw new ApiError(400, "Log has already stopped!");
    }

    const task = await Task.findById(taskId);
    if(!task){
        // return res.status(404).json({ msg: "This Task not found!!!"});
        throw new ApiError(404, "This Task not found!!!");
    }

    const endTime = new Date();
    const timeSpent = (endTime - log.startTimeOfLog) / (1000 * 60 * 60 );

    const updatedLog = await Log.findByIdAndUpdate(logId, 
        {
            $set: {
                name,
                description,
                endTimeOfLog: endTime,
                timeSpent: timeSpent,
                task: taskId || log.task
            }
        },
        { new: true }
    );

    await Project.findByIdAndUpdate(log.projectId, {
        $inc: {
            totalHours: timeSpent,
        }
    });

    if(taskId){
        await Task.findByIdAndUpdate(taskId, {
            $inc: {
                totalTimeSpentOnTask: timeSpent,
            },
        });
    }

    return res.status(200).json(
        // { updatedLog, msg: "Log stopped successfully!!"}
        new ApiResponse(200, updatedLog, "Log stopped successfully!!!")    
    );
};

const updateTimeLog = async (req, res) => {
    // log id chaiye, name, description bhii chaye
    // validate them
    // then find the log, if not found throw error msg
    // then update that log
    // then update project hours
    // return updated log and msg

    const { logId } = req.params;
    const { name, description } = req.body;

    if(!isValidObjectId(logId)){
        // return res.status(400).json({msg: "Invalid LogId"});
        throw new ApiError(400, "Invalid LogId");
    }

    const log = await Log.findById(logId);
    if(!log){
        // return res.status(404).json({msg: "Log not found!!"});
        throw new ApiError(404, "Log not found");
    }

    const updatedLog = await Log.findByIdAndUpdate(logId,
        {
            $set: {
                name,
                description,
            }
        },
        { new: true}
    );
    if(!updatedLog){
        // return res.status(401).json({msg: "Log could not be updated, try again!"});
        throw new ApiError(401, "Log could not be updated, try again!");
    }

    return res.status(200).json(
        // {updatedLog, msg: "Log Updated Successfully"}
        new ApiResponse(200, updatedLog, "Log Updated Successfully")
    );
};

const deleteTimeLog = async (req, res) => {
    // logId from params
    // find if that log exists or not, if not throw error msg
    // then delete that log
    // then update project hours, remove the timespent of this log from totalHours
    // return msg

    const { logId } = req.params;
    if (!isValidObjectId(logId)) {
        // return res.status(400).json({msg: "Invalid Log Id"});
        throw new ApiError(400, "Invalid Log Id");
    }

    const log = await Log.findById(logId);
    if(!log){
        // return res.status(404).json({msg: "Log not found to delete!!"});
        throw new ApiError(404, "Log not found to delete!!");
    }

    const deletedLog = await Log.findByIdAndDelete(logId);
    if(!deletedLog){
        // return res.status(401).json({msg: "Log could not be deleted, try again!!"});
        throw new ApiError(401, "Log could not be deleted, try again!!");
    }

    // update the project
    await Project.findByIdAndUpdate(log.projectId, {
            $pull: { logs: logId },
            $inc: {
                totalHours: -log.timeSpent,
            }
        },
        { new: true }
    );

    return res.status(200).json(
        // {msg: "Log has been deleted successfully!!"}
        new ApiResponse(200, null, "Log has been deleted successfully!!")
    );
};

const getAllLogsOfAProject = async (req, res) => {
    // get the project id from params, validate it
    // find all logs of that project
    // return all logs of that project

    const { projectId } = req.params;
    if(!isValidObjectId(projectId)){
        // return res.status(400).json({msg: "Invalid Project Id"});
        throw new ApiError(400, "Invalid Project Id");
    };

    const logs = await Log.find({projectId}).populate('projectId userId').sort({createdAt: -1});
    if(!logs || logs.length === 0){
        // return res.status(404).json({msg: "No logs found for this project!!"});
        throw new ApiError(404, "No logs found for this project!!");
    }

    return res.status(200).json(
        // { logs, msg: "All logs of this project fetched successfully!!"}
        new ApiResponse(200, logs, "All logs of this project fetched successfully!!")
    );
};

const getAllLogsForAUser = async (req, res) => {
    // get the user id from the token, validate it
    // find all logs of that user
    // return all logs of that user

    const userId = req.user?._id;
    if(!isValidObjectId(userId)){
        // return res.status(400).json({msg: "Invalid User Id"});
        throw new ApiError(400, "Invalid User Id");
    }

    const logs = await Log.find({userId}).sort({createdAt: -1}).populate('projectId');
    if(!logs || logs.length === 0){
        // return res.status(404).json({msg: "No logs found for this user!!"});
        throw new ApiError(404, "No logs found for this user!!");
    }

    return res.status(200).json(
        // { logs, msg: "All logs of this user fetched successfully!!"}
        new ApiResponse(200, logs, "All logs of this user fetched successfully!!")
    );
};

const getAllLogsOfATask = async (req, res) => {
    const { taskId } = req.params;
    if(!isValidObjectId(taskId)){
        // return res.status(400).json({msg: "Invalid Task Id"});
        throw new ApiError(400, "Invalid Task Id");
    }

    const task = await Task.findById(taskId);
    if (!task) {
        // throw new ApiError(404, "No task found!!!!");
        throw new ApiError(404, "No task found!!!!");
    }

    const logs = await Log.find({ task: task?._id}).populate('task');
    if(!logs || logs.length === 0){
        // throw new ApiError(404, "No logs found for this task!!");
        throw new ApiError(404, "No logs found for this task!!");
    }

    return res.status(200).json(
        // { logs, msg: "All logs of this task fetched successfully!!"}
        new ApiResponse(200, logs, "All logs of this task fetched successfully!!")
    );
};

const addLogToTask = async (req, res) => {
    // logid se related task ko find karo, agar dono exist karte hain to update kar do
    // task ki time spent field ko bhi update kar do

    const { logId, taskId } = req.params;
    if (!isValidObjectId(logId) || !isValidObjectId(taskId)) {
        // return res.status(400).json({msg: "Invalid Log ID or Task ID"});
        throw new ApiError(400, "Invalid Log ID or Task ID");
    }

    const log = await Log.findById(logId);
    const task = await Task.findById(taskId);
    if(!log || !task){
        // return res.status(404).json({msg: "Log or Task not found"});
        throw new ApiError(404, "Log or Task not found");
    }

    log.task = task._id;
    await log.save();

    return res.status(200).json(
        // { log, msg: "Log added to task successfully :)"}
        new ApiResponse(200, log, "Log added to task successfully :)")
    );
};

export {
    startLogTime,
    stopLogTime,
    updateTimeLog,
    deleteTimeLog,
    getAllLogsOfAProject,
    getAllLogsForAUser,
    getAllLogsOfATask,
    addLogToTask
};
