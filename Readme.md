# Freelancer Time Tracker API

## Overview
***The Freelancer Time Tracker API is a RESTful API built using Express.js and MongoDB to help freelancers track time spent on various projects and manage tasks. It also allows project owners to manage team members, while generating work summaries. This API provides functionality for project management, task management, time logging, and generating summary reports.***

### Core Features:
- **Project Management:** Create, update, and delete & get projects.
- **Time Logging:** Log time entries against specific projects with timestamps and descriptions.
- **Task Management:** Create and manage tasks within projects and assign them to team members.
- **Task Time Logging:** Log time entries against tasks for more detailed tracking.
- **Project Member Management:** Project owners can add or remove members to/from the project.
- **Summary Reports:** Generate summaries such as hours worked per project, total hours for a date range, and task-based reports.
- **User Authentication:** Secure access with user authentication to ensure freelancers can only access their own data.
- **Data Validation:** Middleware to validate incoming request data.
- **Export Functionality:** (Future enhancement) Allow exporting summaries as PDF or CSV files.
- **Rate Limiting:** Limit the number of requests per IP to prevent abuse.
- **API Documentation:** Interactive Swagger UI for easy access to API endpoints.

### Technologies
- Node.js - JavaScript runtime for building the server.
- Express.js - Web framework for handling API routes and server setup.
- MongoDB - NoSQL database for storing project, task, and time log data.
- Mongoose - ODM for MongoDB to model data and interact with the database.
- JWT (JSON Web Token) - Used for user authentication and session management.

### API Endpoints
#### Project Management
- **Create a Project:** POST /project/createProjet
- **Get Project by ID:**  GET /project/getProjectById/{projectI}
- **Get Projects of a User:** GET /project/getProjectsOfAUser
- **Get All Projects:** GET /project/getAllProjects
- **Update a Project:** PATCH /project/updateProject/{projectId}
- **Delete a Project:** DELETE /project/deleteProject/{projectId}
- **Add Members to a Project:** PATCH /project/addMembersToProject/{projectId}/user/{userId}
- **Get All Projects User is Member of:** GET /project/getAllProjectsUserIsMemberOf/{userId}
#### Task Endpoints
- **Create a Task:** POST /task/createTask/{projectId}
- **Update a Task:** PATCH /task/updateTask/{taskId}
- **Delete a Task:** DELETE /task/deleteTask/{taskId}
- **Get Tasks for a Project:** GET /task/getProjectTasks/{projectId}
- **Get All Tasks:** GET /task/getAllTasks
- **Add a Checklist Item to a Task:** PATCH /task/addChecklistItem/{taskId}
- **Update a Checklist Item for a Task:** PATCH /task/updateChecklistItem/task/{taskId}/item/{itemId}

- **Get Task by ID**: GET /task/getTaskById/{taskId}
- **Get All Tasks of a User:** GET /task/getAllTasksOfUser
#### Log Endpoints
- **Start a Log:** POST /logs/start/{projectId}
- **Stop a Log:** POST /logs/stop/{logId}/task/{taskId}
- **Update a Log:** PATCH /logs/updateLog/{logId}
- **Delete a Log:** DELETE /logs/deleteLog/{logId}
- **Get All Logs for a Project:** GET /logs/getAllLogsOfAProject/{projectId}
- **Get All Logs for a User:** GET /logs/getAllLogsOfAUser
- **Get All Logs for a Task:** GET /logs/getAllLogsOfATask/{taskId}
#### Project Member Manageent
- **Add Member**: POST /api/v1/project/:projectId/members/:userId
- **Remove Member**: DELETE /api/v1/project/:projectId/members/:userId
#### Summary Reports
- **Get Total Hours Per Project Summary:** GET /api/v1/summary/getTotalHoursPerProject
- **Get Total Hours for date range Range Summary:** GET /api/v1/summary/getTotalHoursForADateRange
#### Authentication
- **Register:** POST /api/v1/user/register
- **Login:** POST /api/v1/user/login

### API Documentation
```
/api-docs
```

### Installation
```javascript
cd <into the folder>
npm i

// set the environment variables
PORT=<your_port>
MONGODB_URI=<your_mongodb_uri>

// Set your secret keys accordingly 

npm start
```