const User = require('./user');
const UserNotFoundException = require('./userNotFoundException');
const bCrypt = require('bcrypt');

const create = async (user) => {
  const { username, email, password } = user;
  const hashedPassword = await bCrypt.hash(password, 10);

  const cretedUser = await User.create({ username, email, password: hashedPassword, inactive: false });
  return cretedUser;
};

const getUsers = async (pagination) => {
  const { page, size } = pagination;

  const usersWithCount = await User.findAndCountAll({
    limit: size,
    offset: page * size,
    attributes: ['id', 'username', 'email'],
  });
  return {
    content: usersWithCount.rows,
    totalPages: Math.ceil(usersWithCount.count / Number.parseInt(size)),
  };
};

const getUser = async (id) => {
  const user = await User.findOne({ where: { id: id } });
  if (!user) {
    throw new UserNotFoundException();
  }
  return user;
};

const updateUser = async (id, body) => {
  let user = await User.findOne({ where: { id: id } });
  if (!user) {
    throw new UserNotFoundException();
  }
  await User.update({ username: body.username }, { where: { id: id } });
  user = await User.findOne({ where: { id: id } });
  return user;
};

const deleteUser = async (id) => {
  await User.destroy({ where: { id: id } });
};

const findByEmail = async (email) => {
  return await User.findOne({ where: { email: email } });
};

module.exports = {
  create,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  findByEmail,
};
