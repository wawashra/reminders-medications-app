module.exports = function MedicationNotFoundException() {
  this.status = 404;
  this.message = 'Medication not found';
};
