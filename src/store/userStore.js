// In-memory user store (simulates a database)
const users = [];

const findByEmail = (email) => users.find((u) => u.email === email);

const create = (user) => {
  users.push(user);
  return user;
};

const clear = () => {
  users.length = 0;
};

module.exports = { findByEmail, create, clear };
