const User = require("../model/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  console.log(user, pwd);
  if (!user || !pwd)
    return res.status(400).json({ message: "Username or password required" });

  //ensure user exists
  const foundUser = await User.findOne({ username: user }).exec();
  if (!foundUser)
    return res.status(401).json({ message: "User does not exist" });


  //compare password in the db to one in the request
  const matchPwd = await bcrypt.compare(pwd, foundUser.password);
  console.log(matchPwd)
  if (matchPwd) {
    const roles = Object.values(foundUser.roles).filter(Boolean);
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );

    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    console.log(result);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });// set secure to true in production

    res.json({ roles, accessToken });
  } else {
    res.status(401).json({ message: "Incorrect password" });
  }
};

module.exports = { handleLogin };
