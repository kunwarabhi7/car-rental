import { body, validationResult } from "express-validator";

//register Validator
export const validateRegister = [
  body("username").notEmpty().withMessage("Username Required"),
  body("email")
    .notEmpty()
    .withMessage("Email Required")
    .isEmail()
    .withMessage("Please enter a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    next();
  },
];

// Login validation (identifier = email ya username)
export const validateLogin = [
  body("identifier").notEmpty().withMessage("Email or Username required"),
  body("password").notEmpty().withMessage("Password required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
