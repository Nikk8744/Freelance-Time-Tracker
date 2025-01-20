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
- **Create Project**: POST /api/v1/project
- **Get Projects**: GET /api/v1/project
- **Get Project By ID**: GET /api/v1/project/:projectId
- **Update Project**: PUT /api/v1/project/:projectId
- **Delete Project**: DELETE /api/v1/project/:projectId
#### Task Management
- **Create Task**: POST /api/v1/project/:projectId/task
- **Get Tasks**: GET /api/v1/project/:projectId/task
- **Get Task By ID**: GET /api/v1/task/:taskId
- **Update Task**: PUT /api/v1/task/:taskId
- **Delete Task**: DELETE /api/v1/task/:taskId
#### Time Logging
- **Log Time for Project**: POST /api/v1/project/:projectId/logs
- **Log Time for Task**: POST /api/v1/task/:taskId/logs
- **Get Time Logs**: GET /api/v1/project/:projectId/logs or GET /api/v1/task/:taskId/logs
#### Project Member Management
- **Add Member**: POST /api/v1/project/:projectId/members/:userId
- **Remove Member**: DELETE /api/v1/project/:projectId/members/:userId
#### Summary Reports
- **Generate Project** Summary: GET /api/v1/project/:projectId/summary
- **Generate Date** Range Summary: GET /api/v1/summary?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
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