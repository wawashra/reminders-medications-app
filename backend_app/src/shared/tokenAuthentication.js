const TokenService = require('../auth/tokenService');

const tokenAuthentication = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.substring(7);
    try {
      const user = await TokenService.verify(token);
      req.authenticatedUser = user;
      console.log('Hii toket');
    } catch (err) {
      // eslint-disable-next-line no-empty
      console.log(err);
    }
  }
  next();
};

module.exports = tokenAuthentication;
