const sequelize = require('./src/config/database');
const userService = require('./src/user/userService');

const app = require('./src/app');

const refDb = false;

if (process.env.NODE_ENV === 'development') {
  sequelize.sync({ force: refDb }).then(async () => {
    if (refDb) {
      for (let i = 1; i <= 15; i++) {
        const user = {
          username: `user${i}`,
          email: `user${i}@mail.com`,
          password: 'P4ssword',
        };
        await userService.create(user);
      }
    }
  });
} else {
  sequelize.sync({ force: false });
}

app.listen(3000, () => {
  console.log(`app is running in mode: ${process.env.NODE_ENV}`);
});
