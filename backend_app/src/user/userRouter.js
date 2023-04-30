const express = require('express');
const router = express.Router();
const idNumberControl = require('../shared/idNumberControl');
const pagination = require('../shared/pagination');
const userService = require('./userService');

const { userValidationChain, userValidationMiddleware, userAuthValidationMiddleware } = require('./userValidation');

router.post('/users', userValidationChain, userValidationMiddleware, async (req, res) => {
  const cretedUser = await userService.create(req.body);
  res.status(201).send({ msg: 'success', content: cretedUser });
});

router.get('/users', userAuthValidationMiddleware, pagination, async (req, res) => {
  const page = await userService.getUsers(req.pagination);
  res.send(page);
});

router.get('/users/:id', idNumberControl, async (req, res, next) => {
  try {
    const user = await userService.getUser(req.params.id);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

router.put('/users/:id', idNumberControl, async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    res.status(200).send({ msg: 'success', user: updatedUser });
  } catch (error) {
    next(error);
  }
});

router.delete('/users/:id', idNumberControl, async (req, res) => {
  await userService.deleteUser(req.params.id);
  res.send('removed');
});

module.exports = router;
