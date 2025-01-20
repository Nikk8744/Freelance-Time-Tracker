
import { body, param, validationResult } from 'express-validator';

// Validation for creating a new task
const createTaskValidationRules = () => [
  body('subject')
    .not().isEmpty().withMessage('Task subject is required')
    .isLength({ min: 5 }).withMessage('Task subject must be at least 5 characters long')
    .isLength({ max: 100 }).withMessage('Task subject cannot be longer than 100 characters'),

  body('description')
    .not().isEmpty().withMessage('Task description is required')
    .isLength({ min: 5 }).withMessage('Task description must be at least 10 characters long')
    .isLength({ max: 500 }).withMessage('Task description cannot be longer than 500 characters'),

  body('dueDate')
    .optional()
    .isISO8601().withMessage('Invalid date format for due date')
    .custom((value) => {
      if (value && new Date(value) < new Date()) {
        throw new Error('Due date must be in the future');
      }
      return true;
    }),
];

// Validation for updating an existing task
const updateTaskValidationRules = () => [
  body('subject')
    .optional()
    .isLength({ min: 5 }).withMessage('Task subject must be at least 5 characters long')
    .isLength({ max: 100 }).withMessage('Task subject cannot be longer than 100 characters'),

  body('description')
    .optional()
    .isLength({ min: 5 }).withMessage('Task description must be at least 10 characters long')
    .isLength({ max: 500 }).withMessage('Task description cannot be longer than 500 characters'),

  body('dueDate')
    .optional()
    .isISO8601().withMessage('Invalid date format for due date')
    .custom((value) => {
      if (value && new Date(value) < new Date()) {
        throw new Error('Due date must be in the future');
      }
      return true;
    }),
];

// Validation for adding a checklist item to a task
const addChecklistItemValidationRules = () => [
  param('taskId')
    .not().isEmpty().withMessage('Task ID is required')
    .isMongoId().withMessage('Invalid task ID'),

  body('item')
    .not().isEmpty().withMessage('Checklist item is required')
    .isLength({ min: 3 }).withMessage('Checklist item must be at least 5 characters long')
    .isLength({ max: 200 }).withMessage('Checklist item cannot be longer than 200 characters'),
];

// General validation function to check errors and send responses
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export {
  createTaskValidationRules,
  updateTaskValidationRules,
  addChecklistItemValidationRules,
  validate,
};
