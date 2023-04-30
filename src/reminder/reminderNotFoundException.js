module.exports = function ReminderNotFoundException() {
  this.status = 404;
  this.message = 'Reminder not found';
};
