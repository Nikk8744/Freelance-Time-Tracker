## Freelance Time Tracker

#### Things to do:
- Create a simple time tracker for freelancers to track their work hours. ✔️
- The tracker should be able to add, remove, and list tasks. ✔️
- The tracker should be able to calculate the total hours worked for each task. ✔️
- The tracker should be able to calculate the total hours worked for all tasks. ✔️
- The tracker should be able to edit, update and delete logs. ✔️
- The tracker should be able to export logs to a CSV file. ✔️
- Add validation logic. - express-validator or joi for validation. ✔️
    - Validate task name and description. ✔️
    - Validate start and end time. ✔️
    - Validate hours worked is a number and not negative. ✔️
    - validate that start time is before end time. ✔️
    - validate that task subject and startdate is not empty.✔️
    - validate that start and end time is in the correct format. ✔️
- Add error handling.

##### Advance to dos
- can add task mgmt system also - ✔️

## new project feature
- add a owner to project - the owner can be a user/ the one who created the project
- add a team/members to project - the team/members can be a list of users
- only those team members can create their tasks in that project
- 


-----
- when i delete a log it should be deleted form project and task as well. ✔️


_________________________

- when a log is added it should be added to project.logs array as well ✔️
- when a log is removed/deleted it should be removed from project.logs array as well✔️
- log duration calculation can be done in hours - need to update the calculation logic. ✔️
- implement all the validation logic for all routes and parameters ✔️
- when log is deleted the totalTimeSpentOnatask of that log should be removed