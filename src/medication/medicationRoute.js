const express = require('express');
const router = express.Router();
const idNumberControl = require('../shared/idNumberControl');
const pagination = require('../shared/pagination');
const medicationService = require('./medicationService');
const { userAuthValidationMiddleware } = require('../user/userValidation');

router.post('/medications', userAuthValidationMiddleware, async (req, res) => {
  const cretedMedication = await medicationService.create({ name: req.body.name, userId: req.authenticatedUser.id });
  res.status(201).send({ msg: 'success', content: cretedMedication });
});

router.get('/medications', userAuthValidationMiddleware, pagination, async (req, res) => {
  const page = await medicationService.getMedications(req.pagination, req.authenticatedUser.id);
  res.send(page);
});

router.get('/medications/:id', userAuthValidationMiddleware, idNumberControl, async (req, res, next) => {
  try {
    const user = await medicationService.getMedication(req.params.id, req.authenticatedUser.id);
    res.send(user);
  } catch (error) {
    next(error);
  }
});

router.put('/medications/:id', userAuthValidationMiddleware, idNumberControl, async (req, res, next) => {
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
});

router.delete('/medications/:id', userAuthValidationMiddleware, idNumberControl, async (req, res) => {
  await medicationService.deleteMedication(req.params.id, req.authenticatedUser.id);

  res.status(200).send({ msg: 'removed', content: {} });
});

module.exports = router;
