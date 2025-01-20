import { isValidObjectId } from "mongoose";
import { Project } from "../models/project.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const createProject = async(req, res) => {
    const { name, description, startDate, endDate } = req.body;
    const userId = req.user?._id;

    if ([name, description, startDate, endDate].some((field) => field.trim() === "")) {
        // return res.status(400).json({msg: "All fields are required"})
        throw new ApiError(400, "All fields are required!!")
    }

   try {
     const existingProject = await Project.findOne({name});
     if (existingProject) {
        //  return res.status(400).json({mjsg: "Project with this name alraeady exists"})
        throw new ApiError(400, "Project with this name already exists!!")
     };
 
     const newProject = await Project.create({
         name,
         description,
         startDate,
         endDate,
         owner: userId,
         totalHours: 0,
     });
 
     if (!newProject) {
        //  return res.status(401).json({ msg: "Something went wrong while creating project"})
        throw new ApiError(401, "Something went wrong while creating this project!!")
     }
 
     return res.status(200).json(
        // {newProject,
        //  msg: "Project Created Successfully"}
        new ApiResponse(201, newProject, "Project Created Successfully!!")
    );
   } catch (error) {
    return res.status(500).json({ msg: "Some server error occurred while creating project"})
   }
}

const getProjectById = async(req, res) => {
    const { projectId } = req.params;
    if (!isValidObjectId(projectId)) {
        return res.status(401).json({ msg: "Enter valid project Id"})
    }

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ msg: "Project Not Found!!"})
        };
    
        return res.status(200).json(
            new ApiResponse(200, project, "Project Fetched Successfully!! :)")
        )
    } catch (error) {
        return res.status(500).json({msg: "Some server error occurred while retrieving project!! :("})
    }
}

const getAllProjectsOfAUser = async (req, res) => {
    const userId = req.user?._id;

    const allProjects = await Project.find({ owner: userId });
    if (!allProjects || allProjects.length === 0) {
        return res.status(400).json({msg: "Projects not found. You need to create a project"})
    };

    return res.status(200).json(
        new ApiResponse(200, allProjects, "All projects of user fetched successfully!!")
    )
};

const getAllProjects = async(req, res) => {

    const allProjects = await Project.find();
    if (!allProjects || allProjects.length === 0) {
        return res.status(400).json({msg: "No projects found!!"})
    }

    return res.status(200).json(
        new ApiResponse(200, allProjects, "All projects fetched successfully!!")
    );
};

const updateProject = async(req, res) => {
    const { projectId } = req.params;
    const { name, description, startDate, endDate, status } = req.body;

    if(!name && !description && !startDate && !endDate && !status){
        return res.status(400).json({ msg: "Enter some details to change/update"})
    }

    try {
        const project = await Project.findById(projectId);

        if(project.owner?.toString() !== req.user?._id.toString()){
            return res.status(400).json({ msg: "You are not authorized to make changes to this project!!"})
        }

        const updateProject = await Project.findByIdAndUpdate(projectId, 
            {
                $set: {
                    name,
                    description,
                    startDate,
                    endDate,
                    status,
                }
            },
            { new: true }
        );

        if(!updateProject){
            return res.status(401).json({msg: "Something went wrong while updating project"})
        }

        return res.status(200).json(
            new ApiResponse(200, updateProject, "Project updated successfully!!")
        );

    } catch (error) {
        return res.status(500).json({msg: "Some server error occurred while updating project!! :("});
    } 
};

const deleteProject = async(req, res) => {
    const { projectId } = req.params;
    if(!isValidObjectId(projectId)){
        return res.status(401).json({msg: "Invalid objectId or project ID"})
    }

    try {
        const deleteProject = await Project.findByIdAndDelete(projectId);
        if (!deleteProject) {
            return res.status(404).json({msg: "Project not found to delete"})
        }

        return res.status(200).json(
            new ApiResponse(200, deleteProject, "Project deleted successfully!!")
        )
    } catch (error) {
        return res.status(500).json({msg: "Some server error occurred while deleting project!! :("})
    }
};

const addMembersToProject = async (req, res) => {
    const { projectId, userId } = req.params;
    if(!isValidObjectId(projectId) || !isValidObjectId(userId)){
        throw new ApiError(401, "Invalid projectId or UserId")
    };

    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found to add members!!")
    };

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found to add members!!")
    }

    if(project.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(401, "You are not the owner of this project, only owner can add members")
    }
    if(project.members.includes(userId)){
        throw new ApiError(401, "User is already a member of this project")
    };
    
    project.members.push(userId);
    await project.save();

    return res.status(200).json(
        new ApiResponse(200, project, "Member added successfully!!")
    )
};

const getAllProjectsUserIsMemberOf = async (req, res) => {
    const { userId } = req.params; 
    if (!isValidObjectId(userId)) {
        throw new ApiError(401, "Invalid userId")
    }

    const projects = await Project.find({ members: userId });
    if(!projects || projects.length === 0){
        throw new ApiError(404, "User is not a member of any project")
    };

    return res.status(200).json(
        new ApiResponse(200, {projects: projects}, "Projects user is a member of fetched successfully!!")
    );
}

export {
    createProject,
    getProjectById,
    getAllProjectsOfAUser,
    getAllProjects,
    updateProject,
    deleteProject,
    addMembersToProject,
    getAllProjectsUserIsMemberOf,
}
