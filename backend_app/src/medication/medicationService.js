const Medication = require('./medication');
const Reminder = require('../reminder/reminder');
const MedicationNotFoundException = require('./medicationNotFoundException');

const create = async (medication) => {
  const { name, userId } = medication;
  const cretedMedication = await Medication.create({ name, userId });
  return cretedMedication;
};

const getMedications = async (pagination, userId) => {
  const { page, size } = pagination;

  const cretedMedicationsWithCount = await Medication.findAndCountAll({
    limit: size,
    offset: page * size,
    attributes: ['id', 'name', 'userId'],
    include: {
      model: Reminder,
      required: false,
    },
    where: {
      userId: userId,
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
  let medication = await Medication.findOne({ where: { id: id, userId: userId } });
  if (!medication) {
    throw new MedicationNotFoundException();
  }

  await Medication.update(
    { name: body.name },
    {
      where: {
        id: id,
        userId: userId,
      },
    }
  );

  medication = await Medication.findOne({ where: { id: id, userId: userId } });
  return medication;
};

const deleteMedication = async (id, userId) => {
  await Medication.destroy({ where: { id: id, userId: userId } });
};

module.exports = {
  create,
  getMedications,
  getMedication,
  updateMedication,
  deleteMedication,
};
