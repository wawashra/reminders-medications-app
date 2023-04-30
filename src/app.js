const express = require('express');

const UserRouter = require('./user/userRouter');
const MedicationRoute = require('./medication/medicationRoute');
const ReminderRoute = require('./reminder/reminderRoute');
const AuthenticationRouter = require('./auth/authenticationRouter');

const errorHandler = require('./error/errorHandler');
const tokenAuthentication = require('./shared/tokenAuthentication');

const app = express();

app.use(express.json());
app.use(tokenAuthentication);
app.use(AuthenticationRouter);
app.use(UserRouter);
app.use(MedicationRoute);
app.use(ReminderRoute);
app.use(errorHandler);

module.exports = app;
