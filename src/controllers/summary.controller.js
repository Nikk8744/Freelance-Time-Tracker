import { Log } from "../models/log.model.js";
import { Project } from "../models/project.model.js";

const getTotalHoursPerProject = async (req, res) => {
    // Get the project ID
    // get the user id
    // get projects of user
    // calculate total hours for each project of user
    // return the total hours for each project of user

    // const { projectId } = req.params;
    const userId = req.user?._id;

    // all the users projects are stored in projects in array
    const projects = await Project.find({userId}).populate("logs")
    // console.log(projects)
    if (!projects) {
        return res.status(404).json({msg: "No project logs found for this user!!"})
    }

    const totalHoursPerProject = projects.map(project => {
        const totalHours = project.totalHours;

        // converting totalHpours to more readable format

        const roundedTotalHours = Math.round(totalHours * 100) / 100;

        // Convert total hours to hours and minutes format
        const hours = Math.floor(roundedTotalHours);
        const minutes = Math.round((roundedTotalHours - hours) * 60);
        
        return {
            projectId: project._id,
            projectname: project.name,
            totalHours:  `${hours} hrs and ${minutes} mins`
        }
    })

    return res.status(200).json({
        totalHoursPerProject,
        msg: "The total hours of each project of the user is returned!!"
    })

}   

const getTotalHoursForADateRange = async (req, res) => {
    // get start date and end date and check and validate
    // get userId
    // then find logs where date is between start and end date
    // then calculate total hours for that data range logs

    const { startDate, endDate } = req.body;
    const userId = req.user?._id;

    if(!startDate || !endDate){
        return res.status(400).json({msg: "Please provide both start and end date!!"})
    }

    const logs = await Log.find({userId, startTimeOfLog: { $gte: startDate, $lte: endDate }});
    // console.log(logs)
    if(!logs){
        return res.status(404).json({msg: "No logs found for the date range you have provided"})
    }

    const totalHoursForRange = logs.reduce((total, log) => total + log.timeSpent, 0);

    const roundedTotalHours = Math.round(totalHoursForRange * 100) / 100;

    // Convert total hours to hours and minutes format
    const hours = Math.floor(roundedTotalHours);
    const minutes = Math.round((roundedTotalHours - hours) * 60);

    return res.status(200).json({
        // totalHoursForRange,
        totalHoursForRange: roundedTotalHours,
        totalHoursFormatted: `${hours} hours and ${minutes} minutes`,
        msg: "The total hours of the user for the given date range is returned!!"
    });
}

export {
    getTotalHoursPerProject,
    getTotalHoursForADateRange,
}