const User = require("../model/User");

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide all the required fields" });
  }
  const foundUser = await User.findOne({ username: username }).exec();
  if (!foundUser) {
    return res.status(404).json({ message: "Username or Password is Wrong" });
  }
  const isMatch = await bcrypt.compare(password, foundUser.password);
  if (!isMatch) {
    return res.status(404).json({ message: "Username or Password is Wrong" });
  }

  const accessToken = jwt.sign(
    {
      username: foundUser.username,
      id: foundUser._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "12h" }
  );
  res.json({
    accessToken,
    id: foundUser._id,
    isAdmin: foundUser.isAdmin,
    companyId: foundUser.companyId,
  });
};

module.exports = { handleLogin };
