const express = require('express');
const router = express.Router();
const UserService = require('../user/userService');
const AuthenticationException = require('./authenticationException');
const ForbiddenException = require('../error/forbiddenException');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const TokenService = require('./tokenService');

router.post('/auth', check('email').isEmail(), async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AuthenticationException());
  }

  const { email, password } = req.body;
  const user = await UserService.findByEmail(email);
  if (!user) {
    return next(new AuthenticationException());
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return next(new AuthenticationException());
  }
  if (user.inactive) {
    return next(new ForbiddenException());
  }
  const token = await TokenService.createToken(user);
  res.send({
    id: user.id,
    username: user.username,
    image: user.image,
    token,
  });
});

router.post('/logout', async (req, res) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.substring(7);
    await TokenService.deleteToken(token);
  }
  res.send();
});

module.exports = router;
