const Reminder = require('./reminder');
const Medication = require('../medication/medication');

const ReminderNotFoundException = require('./reminderNotFoundException');

const MedicationNotFoundException = require('../medication/medicationNotFoundException');
const create = async (reminder) => {
  const { times, days, start_date, end_date, theUserId, medicationId } = reminder;

  const medication = await Medication.findOne({ where: { id: medicationId, userId: theUserId } });
  if (!medication) {
    throw new MedicationNotFoundException();
  }

  const reminderFromDb = await Reminder.findOne({ where: { medicationId: medicationId } });
  if (reminderFromDb) {
    return reminderFromDb;
  }

  const cretedReminder = await Reminder.create({ times, days, start_date, end_date, medicationId });
  return cretedReminder;
};

const getReminders = async (pagination, userId, medicationId) => {
  const medication = await Medication.findOne({ where: { id: medicationId, userId: userId } });
  if (!medication) {
    throw new MedicationNotFoundException();
  }

  const { page, size } = pagination;

  const cretedMedicationsWithCount = await Reminder.findAndCountAll({
    limit: size,
    offset: page * size,
    // attributes: ['id', 'name', 'userId'],
    where: {
      medicationId: medicationId,
    },
  });
  return {
    content: cretedMedicationsWithCount.rows,
    totalPages: Math.ceil(cretedMedicationsWithCount.count / Number.parseInt(size)),
  };
};

const getMedication = async (id, userId) => {
  const medication = await Medication.findOne({ where: { id: id, userId: userId } });
  if (!medication) {
    throw new MedicationNotFoundException();
  }
  return medication;
};

const updateMedication = async (id, userId, body) => {
  const medication = await Medication.findOne({ where: { id: id, userId: userId } });
  if (!medication) {
    throw new MedicationNotFoundException();
  }
  medication.name = body.name;
  medication.UpdatedAt = new Date();

  const updatedMedication = await medication.save();
  return updatedMedication;
};

const deleteMedication = async (id, userId) => {
  await Medication.destroy({ where: { id: id, userId: userId } });
};

module.exports = {
  create,
  getReminders,
  getMedication,
  updateMedication,
  deleteMedication,
};
