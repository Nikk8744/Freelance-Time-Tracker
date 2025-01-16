import { isValidObjectId } from "mongoose";
import { Project } from "../models/project.model.js";
import { Log } from "../models/log.model.js";

const startLogTime = async (req, res) => {
    
    const userId = req.user?._id;
    const { projectId } = req.params;

    if(!isValidObjectId(projectId)){
        return res.status(400).json({msg: "Invalid porject ID"})
    }

    try {
        const project = await Project.findById(projectId);
        if(!project){
            return res.status(404).json({ msg: "Project not found!!"})
        }
    
        const newLog = await Log.create({
            userId: userId,
            projectId: projectId,
            startTimeOfLog: new Date(),
            endTimeOfLog: null,
            timeSpent: 0,
        });
        if (!newLog) {
            return res.status(401).json({msg: "Something went wrong while creating the log!!!"})
        }

        // to update the project.logs array
        project.logs.push(newLog?._id);
        await project.save();

        return res.status(200).json({
            newLog,
            msg: "Log started successfully!!"
        })
    } catch (error) {
        return res.status(500).json({msg: "Something went wrong with the server while starting the log"})
    }
};

const stopLogTime = async (req, res) => {
    const { logId } = req.params;
    const { name, description } = req.body;
    if(!isValidObjectId(logId)){
        return res.status(400).json({ msg: "Invalid log ID!!"})
    }
    if(!name || !description){
        return res.status(401).json({msg: "Broo name and description are required while stoppign the timer brother!!"})
    }

    try {
        const log = await Log.findById(logId);
        if (!log) {
            return res.status(404).json({ msg: "Log not found!!"})
        }
        if(log.endTimeOfLog){
            return res.status(400).json({ msg: "Log has alraeady stopped!!"})
        }
    
        const endTime = new Date();
        const timeSpent = (endTime - log.startTimeOfLog) / (1000 * 60 * 60 );
    
        // log.endTimeOfLog = endTime;
        // log.timeSpent = timeSpent;
        // await log.save();
        const updatedLog = await Log.findByIdAndUpdate(logId, 
            {
                $set: {
                    name,
                    description,
                    endTimeOfLog: endTime,
                    timeSpent: timeSpent
                }
            },
            { new: true }
        )

        await Project.findByIdAndUpdate(log.projectId, {
            $inc: {
                totalHours: timeSpent,
            }
        });
    
        return res.status(200).json({
            updatedLog,
            msg: "Log stopped successfully!!"
        });
    } catch (error) {
        return res.status(500).json({ msg: "Server error occurred while stopping the log!!" })
    }
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
        return res.status(400).json({msg: "Invalid log id!!" });
    }

    try {
        const log = await Log.findById(logId);
        if(!log){
            return res.status(404).json({msg: "Log not found!!" });
        }

        // const { endTimeOfLog, timeSpent } = log;
        const updatedLog = await Log.findByIdAndUpdate(logId,
            {
                $set: {
                    name,
                    description,    
                    // endTimeOfLog: endTimeOfLog,
                    // timeSpent: timeSpent
                }
            },
            { new: true}
        );
        if(!updatedLog){
            return res.status(401).json({msg: "Log could not be updated try again!!" });
        }

        return res.status(200).json({
            updatedLog,
            msg: "Log updated successfully!!"
        })
    } catch (error) {
        return res.status(500).json({msg: "Some Error occurred while updating the log"})
    }
};

const deleteTimeLog = async (req, res) => {
    // logId from params
    // find if that log exists or not, if not throw error msg
    // then delete that log
    // then update project hours, remoive the timespent of this log from totalHours
    // return msg

    const { logId } = req.params;
    if (!isValidObjectId(logId)) {
        return res.status(400).json({msg: "Invalid Log Id"})
    }

    try {
        const log = await Log.findById(logId);
        if(!log){
            return res.status(404).json({msg: "Log not found to delete!!"})
        }
    
        const deletedLog = await Log.findByIdAndDelete(logId);
        if(!deletedLog){
            return res.status(401).json({msg: "Log could not be deleted try again!!"})
        } 
        // update the proiject
        await Project.findByIdAndUpdate(log.projectId, {
                $pull: { logs: logId },
                $inc: {
                    totalHours: -log.timeSpent,
                }
            },
            { new: true }
        );
    
        return res.status(200).json({msg: "Log has been deleted successfully!!"})
    } catch (error) {
        return res.status(500).json({msg: "Some Error occurred while deleting the log"})
    }
};

const getAllLogsOfAProject = async (req, res) => {
    // get the project id from paramsm, validate it
    // find all logs of that project
    // return all logs of that project

    const { projectId } = req.params;
    if(!isValidObjectId(projectId)){
        return res.status(400).json({msg : "Invalid Project Id"});
    };

    try {
        const logs = await Log.find({projectId}).populate('projectId userId').sort({createdAt: -1});
        if(!logs){
            return res.status(404).json({msg: "No logs found for this project!!"});
        }
    
        return res.status(200).json({
            logs,
            msg: "All logs of this project fetched successfully!!"
        });
    } catch (error) {
        return res.status(500).json({msg: "Something went wrong while fetching all the logs for this project!!"})
    }
};

const getAllLogsForAUser = async (req, res) => {
    // get the user id from the token, validate it
    // find all logs of that user
    // return all logs of that user
    const userId  = req.user?._id;
    if(!isValidObjectId(userId)){
        return res.status(400).json({msg : "Invalid User Id"});
    }
    try {
        const logs = await Log.find({userId}).sort({createdAt: -1}).populate('projectId');;
        if(!logs){
            return res.status(404).json({msg: "No logs found for this user!!"})
        }
        return res.status(200).json({
            logs,
            msg: "All logs of this user fetched successfully!!"
        });
    } catch (error) {
        return res.status(500).json({msg: "Something went wrong while fetching all the logs"})
    }
};

export {
    startLogTime,
    stopLogTime,
    updateTimeLog,
    deleteTimeLog,
    getAllLogsOfAProject,
    getAllLogsForAUser,
}