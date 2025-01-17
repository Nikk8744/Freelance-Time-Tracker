import { body, param, validationResult } from "express-validator"

const startLogValidationRules = () => [
    param('projectId')
        .not().isEmpty()
        .withMessage('Project ID is required')
        .isMongoId()
        .withMessage('Invalid project ID')
];

const stopLogValidationRules = () => [
    param('logId')
        .isMongoId()
        .withMessage('Invalid log ID'),

    body('name')
        .not().isEmpty()
        .withMessage('Name is required'),

    body('description')
        .not().isEmpty()
        .withMessage('Description is required'),
];

const logUpdateValidationRules = () => [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 3 }).withMessage('Log name must be at least 3 characters long'),

    body('description')
        .optional()
        .trim()
        .isLength({ min: 5 }).withMessage('Description must be at least 5 characters long'),

    // body('userId')
    //     .not().isEmpty()
    //     .withMessage('User ID is required')
    //     .isMongoId()
    //     .withMessage('User ID must be a valid MongoDB ObjectId'),
    
    body('startTimeOfLog')
        .optional()
        .isISO8601()
        .withMessage('Start time must be a valid date'),

    body('endTimeOfLog')
        .optional()
        .isISO8601()
        .withMessage('End time must be a valid date'),
]

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

export {
    startLogValidationRules,
    stopLogValidationRules,
    logUpdateValidationRules,
    validate,
}