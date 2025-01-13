import { isValidObjectId } from "mongoose";
import { Project } from "../models/project.model.js";
import { Log } from "../models/log.model.js";

const startLogTime = async (req, res) => {
    
    const userId = req.user?._id;
    const { projectId } = req.body;

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
        return res.status(400).json({msg: "Broo name and description are required while stoppign the timer brother!!"})
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


export {
    startLogTime,
    stopLogTime,
}