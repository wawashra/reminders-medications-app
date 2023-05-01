const express = require('express');
const router = express.Router();
const idNumberControl = require('../shared/idNumberControl');
const reminderService = require('./reminderService');
const { userAuthValidationMiddleware } = require('../user/userValidation');

router.post('/medications/:id/reminders', userAuthValidationMiddleware, idNumberControl, async (req, res, next) => {
  try {
    const medicationId = req.params.id;
    const userId = req.authenticatedUser.id;

    const cretedMedication = await reminderService.createOrUpdate({
      times: req.body.times,
      days: req.body.days,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      userId: userId,
      medicationId: medicationId,
    });
    res.status(cretedMedication.isNewRecord ? 201 : 200).send({ msg: 'success', content: cretedMedication });
  } catch (error) {
    next(error);
  }
});

router.get('/medications/:id/reminders', userAuthValidationMiddleware, idNumberControl, async (req, res, next) => {
  try {
    const medicationId = req.params.id;
    const userId = req.authenticatedUser.id;
    const medication = await reminderService.getReminders(userId, medicationId);
    res.send(medication);
  } catch (error) {
    next(error);
  }
});

router.delete('/medications/:id/reminders', userAuthValidationMiddleware, idNumberControl, async (req, res) => {
  const medicationId = req.params.id;
  const userId = req.authenticatedUser.id;
  await reminderService.deleteReminders(userId, medicationId);

  res.status(200).send({ msg: 'removed', content: {} });
});

router.get('/reminders', userAuthValidationMiddleware, async (req, res, next) => {
  try {
    const userId = req.authenticatedUser.id;
    const reminders = await reminderService.getUserReminders(userId, new Date());
    res.status(200).send({ msg: 'success', content: reminders });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
