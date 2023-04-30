module.exports = function UserForbiddenException() {
  this.status = 403;
  this.message = 'User Forbidden';
};
