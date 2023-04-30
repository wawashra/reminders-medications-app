const { body, validationResult } = require('express-validator');
const userService = require('./userService');
const ValidationException = require('../shared/validationException');

const UserNotFoundException = require('./userForbiddenException');

const userValidationMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new ValidationException(errors.array()));
  }
  next();
};

const userAuthValidationMiddleware = (req, res, next) => {
  const authenticatedUser = req.authenticatedUser;

  if (!authenticatedUser) {
    next(new UserNotFoundException());
  }
  next();
};

const userValidationChain = [
  body('username')
    .notEmpty()
    .withMessage('Username cannot be null')
    .bail()
    .isLength({ min: 4, max: 32 })
    .withMessage('Username must have min 4 max 32 characters'),
  body('email')
    .isEmail()
    .withMessage('Must be a valid e-mail address')
    .bail()
    .custom(async (email) => {
      const user = await userService.findByEmail(email);
      if (user) {
        throw new Error('Email in use');
      }
    }),
];

module.exports = {
  userValidationChain,
  userValidationMiddleware,
  userAuthValidationMiddleware,
};
