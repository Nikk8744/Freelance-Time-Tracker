import { body, validationResult } from "express-validator";

const userValidationRules = () => [
    body('name')
        .trim()
        .isLength({ min: 3 }).withMessage("Name must be atleast 3 characters long")
        .isLength({ max: 50 }).withMessage("Name cannot be longer than 50 characters!!"),

    body('userName')
        .trim()
        .not().isEmpty().withMessage("User Name is required!!")
        .isLength({ min: 3}).withMessage("name must be atleast 3 characters long!!"),

    body('email')
        .trim()
        .normalizeEmail()
        .isEmail().withMessage("Please enter a valid email address!!"),

    body('password')
        .trim()
        .isLength({ min: 5})
        .withMessage('Password must be atleast 5 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one capital letter') // Checks for at least one uppercase letter
        .matches(/[\W_]/).withMessage('Password must contain at least one special character'), // Checks for at least one special character
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export {
    userValidationRules,
    validate
}