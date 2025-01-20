import { body, param, validationResult } from "express-validator";

const projectValidationRules = () => [
    body('name')
        .trim()
        .not().isEmpty().withMessage("Project Name is required")
        .isLength({ min: 5}).withMessage("Project name must be atleast three characters long")
        .isLength({ max: 80 }).withMessage("Project name cannot be longer than 80 characters!!"),

    body('description')
        .trim()
        .not().isEmpty().withMessage('Project description is required')
        .isLength({ min: 5 })
        .withMessage('Project description should be at least 5 characters long'),
    
    body('startDate')
        .isISO8601().withMessage("Project start date must be a valid ISO date"),
    
    body('endDate')
        .isISO8601().withMessage("Project end date must be a valid ISO date")
        .custom((value, { req }) => {
            if(new Date(value) < new Date(req.body.startDate)){
                throw new Error("End date must be after start date");
            }
            return true;
        })
];

const projectUpdateValidationRules = () => [
    body('name')
        .optional()
        .trim()
        .not().isEmpty().withMessage("Project Name is required")
        .isLength({ min: 5}).withMessage("Project name must be atleast three characters long")
        .isLength({ max: 80 }).withMessage("Project name cannot be longer than 80 characters!!"),

    body('description')
        .optional()
        .trim()
        .not().isEmpty().withMessage('Project description is required')
        .isLength({ min: 5 })
        .withMessage('Project description should be at least 5 characters long'),
    
    body('startDate')
        .optional()
        .isISO8601().withMessage("Project start date must be a valid ISO date"),
    
    body('endDate')
        .optional()
        .isISO8601().withMessage("Project end date must be a valid ISO date")
        .custom((value, { req }) => {
            if(new Date(value) < new Date(req.body.startDate)){
                throw new Error("End date must be after start date");
            }
            return true;
        })
];

const addMembersToProjectValidationRules = () => [
    param('projectId')
        .not().isEmpty()
        .withMessage('Project ID is required')
        .isMongoId().withMessage('Invalid project ID'),
    
    param('userId')
        .not().isEmpty()
        .withMessage('Project ID is required')
        .isMongoId().withMessage('Invalid project ID')
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export {
    projectValidationRules,
    validate,
    projectUpdateValidationRules,
    addMembersToProjectValidationRules,
}