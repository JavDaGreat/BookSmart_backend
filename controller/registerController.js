const Company = require("../model/Company");
const User = require("../model/User");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const handleNewUser = async (req, res) => {
  const { name, email, password, companyName, tierPlan, confirmPassword } =
    req.body;

  const companyId = req.body?.companyId;

  if (
    !name ||
    !email ||
    !tierPlan ||
    !password ||
    !confirmPassword ||
    (!companyId && !companyName)
  ) {
    return res
      .status(400)
      .json({ message: "Please provide all the required fields" });
  }

  const pwd = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
  if (!password.match(pwd)) {
    return res.status(400).json({
      message:
        "Password must be between 8 and 20 characters, and include at least one digit and one uppercase letter.",
    });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }
  const DuplicateUser = await User.findOne({ email: email }).exec();

  if (DuplicateUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  try {
    const hashedPwd = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name,
      email,
      password: hashedPwd,
    });

    let foundCompany = companyId
      ? await Company.findOne({ companyId: companyId }).exec()
      : null;

    if (foundCompany) {
      foundCompany.users.push(user._id);
      foundCompany.userCount = foundCompany.users.length;
      user.companyId = foundCompany._id;
      await foundCompany.save();
      await user.save();
    } else {
      const companyExistByName =
        companyName &&
        (await Company.findOne({ companyName: companyName }).exec());

      if (companyExistByName) {
        return res.status(400).json({ message: "Company already exists" });
      }

      foundCompany = await Company.create({
        companyName: companyName,
        companyId: new mongoose.Types.ObjectId(),
        users: [user._id],
        tierPlan,
      });

      foundCompany.userCount = foundCompany.users.length;
      await foundCompany.save();
      user.companyId = foundCompany._id;
      await user.save();
    }

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
