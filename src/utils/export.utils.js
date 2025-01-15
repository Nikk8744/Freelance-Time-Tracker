import { Parser } from 'json2csv';
import fs from 'fs';
import path from 'path';
import { isValidObjectId } from 'mongoose';
import { Project } from '../models/project.model.js';

// in future user can give his path and the file will be dowonladed in that path.
// we will store the path and pass it insted of src
// const exportCSVPath = path.resolve('src', 'controllers', 'logsExport.csv'); // download it in controllers folder
// const exportCSVPath = path.resolve('src/models', 'logsExport.csv'); // store/download it in src/models folder
const exportCSVPath = path.resolve('src', 'logsExport.csv'); // download in src folder 

const exportProjectSummariesInCsv = async (req, res) => {
    // get project from params and validate
    // phir find that project and its logs
    // then take data from all the logs and create a csv file
    // and return that csv file as response

    const { projectId } = req.params;
    if(!isValidObjectId(projectId)){
        return res.status(400).json({msg: "Invalid Proejct Id"})
    }

    try {
        const project = await Project.findById(projectId).populate("logs");
        if(!project){
            return res.status(404).json({msg: "Project not found"})
        };
    
        const logs = project.logs;
        if(logs.length === 0){
            return res.status(404).json({msg: "No logs found for this project"})
        }
    
        // sab logs ke data ko nikal ke logData mai store krna hai so that csv parser ko de sake
        const logData = logs.map(log => ({
            logId: log._id,
            name: log.name,
            description: log.description,
            startTime: log.startTimeOfLog.toISOString(),
            endTime: log.endTimeOfLog ? log.endTimeOfLog.toISOString() : 'Not stopped',
            timeSpent: log.timeSpent.toFixed(2),
        }));
    
        // converting the logData into csv format and csv file create kr rhe hai
        const json2csvParser = new Parser();
        const csvData = json2csvParser.parse(logData);
    
        // to store file in my system
        fs.writeFileSync(exportCSVPath, csvData,'utf-8')
    
        // responsr header to download csv file
        res.header('Content-Type', 'text/csv');
        res.attachment(`project_${projectId}_summary.csv`);
        res.send(csvData);
    } catch (error) {
        return res.status(500).json({msg: "Some error occurred while exporting project summary in csv", error: error.message})
    }
    
}

export {
    exportProjectSummariesInCsv,
}