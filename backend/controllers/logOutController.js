const User = require('../model/User');

const handleLogOut = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content

  const refreshToken = cookies.jwt;
  //ensure user exists
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCokie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });// set secure to true in production
    return res.sendStatus(204);
  }

  //delete refreshToken in db
  foundUser.refreshToken = '';
  const result = await foundUser.save();
  console.log(result);

  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });
  res.sendStatus(204);
};

module.exports = { handleLogOut };
