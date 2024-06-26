const User = require("../model/User");
const Company = require("../model/Company");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide all the required fields" });
  }

  const foundUser = await User.findOne({ email: email }).exec();
  if (!foundUser) {
    return res.status(404).json({ message: "email or Password is Wrong" });
  }

  const isMatch = await bcrypt.compare(password, foundUser.password);
  if (!isMatch) {
    return res.status(404).json({ message: "email or Password is Wrong" });
  }

  const accessToken = jwt.sign(
    {
      email: foundUser.email,
      id: foundUser._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "12h" }
  );

  const company = await Company.findById(foundUser.companyId).exec();
  const colleagues = [];

  await Promise.all(
    company.users.map(async (userId) => {
      if (userId !== foundUser._id) {
        const user = await User.findById(userId);
        if (user) {
          colleagues.push(user.email);
        }
      }
    })
  );

  res.json({
    accessToken,
    id: foundUser._id,
    isAdmin: foundUser.isAdmin,
    companyId: foundUser.companyId,
    name: foundUser.name,
    colleagues,
  });
};

module.exports = { handleLogin };
