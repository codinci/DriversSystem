const usersDB = {
  users: require('../model/users.json'),
  setUsers: function (data) {
    this.users = data;
  },
};
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogOut = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content

  const refreshToken = cookies.jwt;
  //ensure user exists
  const foundUser = usersDB.users.find(
    (person) => person.refreshToken === refreshToken
  );
  if (!foundUser) {
    res.clearCokie('jwt', {
      httpOnly: true,
      sameSite: "None",
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.sendStatus(204);
  }

  //delete refreshToken in db
  const otherUsers = usersDB.users.filter(
    (person) => person.refreshToken !== foundUser.refreshToken
  );
  const currentUser = { ...foundUser, refreshToken: "" };
  usersDB.setUsers([...otherUsers, currentUser]);
  await fsPromises.writeFile(
    path.join(__dirname, '..', 'model', 'users.json'),
    JSON.stringify(usersDB.users)
  );
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: "None",
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.sendStatus(204);
};

module.exports = { handleLogOut };
