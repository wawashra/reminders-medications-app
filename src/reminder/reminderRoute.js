const express = require('express');
const router = express.Router();
const idNumberControl = require('../shared/idNumberControl');
const pagination = require('../shared/pagination');
const reminderService = require('./reminderService');
const { userAuthValidationMiddleware } = require('../user/userValidation');
// {
//   times: ['10:30PM', '11:00AM'],
//   days: ['Sun', 'Wen', 'Thr'],
//   start_date: '14-04-2022',
//   end_date: '04-05-2022'
// }
router.post('/medications/:medicationId/reminders', [userAuthValidationMiddleware], async (req, res, next) => {
  try {
    const medicationId = req.params.medicationId;
    const cretedMedication = await reminderService.create({
      times: req.body.times,
      days: req.body.days,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      theUserId: req.authenticatedUser.id,
      medicationId: medicationId,
    });
    res.status(cretedMedication.isNewRecord ? 201 : 200).send({ msg: 'success', content: cretedMedication });
  } catch (error) {
    next(error);
  }
});

router.get(
  '/medications/:medicationId/reminders',
  [userAuthValidationMiddleware],
  pagination,
  async (req, res, next) => {
    try {
      const medicationId = req.params.medicationId;
      const page = await reminderService.getReminders(req.pagination, req.authenticatedUser.id, medicationId);
      res.send(page);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/medications/:medicationId/reminders/:reminderId',
  userAuthValidationMiddleware,
  idNumberControl,
  async (req, res, next) => {
    try {
      const medicationId = medicationId;
      const user = await medicationService.getMedication(req.params.id, req.authenticatedUser.id);
      res.send(user);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/medications/:medicationId/reminders/:reminderId',
  userAuthValidationMiddleware,
  idNumberControl,
  async (req, res, next) => {
    try {
      const updatedMedication = await medicationService.updateMedication(
        req.params.id,
        req.authenticatedUser.id,
        req.body
      );
      res.status(200).send({ msg: 'success', content: updatedMedication });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/medications/:medicationId/reminders/:reminderId',
  userAuthValidationMiddleware,
  idNumberControl,
  async (req, res) => {
    await medicationService.deleteMedication(req.params.id, req.authenticatedUser.id);

    res.status(200).send({ msg: 'removed', content: {} });
  }
);

module.exports = router;
