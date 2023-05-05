const Reminder = require('./reminder');
const Medication = require('../medication/medication');
const { Op } = require('sequelize');
const MedicationNotFoundException = require('../medication/medicationNotFoundException');

const createOrUpdate = async (reminder) => {
  const { times, days, start_date, end_date, userId, medicationId } = reminder;

  await getMedication(medicationId, userId);

  let reminderObj = await Reminder.findOne({ where: { medicationId: medicationId } });

  if (reminderObj) {
    await Reminder.update(
      { times, days, start_date, end_date, medicationId },
      {
        where: {
          medicationId: medicationId,
        },
      }
    );

    reminderObj = await Reminder.findOne({ where: { medicationId: medicationId } });
    return reminderObj;
  }

  reminderObj = await Reminder.create({ times, days, start_date, end_date, medicationId });
  return reminderObj;
};

const getReminders = async (userId, medicationId) => {
  await getMedication(medicationId, userId);

  const reminder = await Reminder.findOne({ where: { medicationId: medicationId } });

  return reminder;
};

const getUserReminders = async (userId, date) => {
  const filterDate = date ? new Date(date) : new Date();
  const medications = await Medication.findAll({
    include: {
      model: Reminder,
      where: {
        end_date: {
          [Op.gte]: filterDate,
        },
        start_date: {
          [Op.lte]: filterDate,
        },
      },
      required: true,
    },
    where: {
      userId: userId,
    },
  });

  let reminders = [];

  medications.forEach((medication) => {
    // buildedReminder.title = `Don't forget to take your ${medication.dataValues.name} `;
    // buildedReminder.body = `It's time to take your medicine - ${medication.dataValues.name} `;

    medication.dataValues.reminder.dataValues.days.forEach((day) => {
      medication.dataValues.reminder.dataValues.times.forEach((time) => {
        const buildedReminder = {};
        buildedReminder.medicationId = medication.dataValues.id;
        buildedReminder.medicationName = medication.dataValues.name;
        buildedReminder.reminderId = medication.dataValues.reminder.dataValues.id;
        buildedReminder.time = time;
        buildedReminder.weekday = day;
        reminders.push(buildedReminder);
      });
    });
  });

  return reminders;
};

const getMedication = async (id, userId) => {
  const medication = await Medication.findOne({ where: { id: id, userId: userId } });
  if (!medication) {
    throw new MedicationNotFoundException();
  }
  return medication;
};

const deleteReminders = async (userId, medicationId) => {
  await getMedication(medicationId, userId);

  await Reminder.destroy({ where: { medicationId: medicationId } });
};

module.exports = {
  createOrUpdate,
  getReminders,
  getUserReminders,
  deleteReminders,
};
