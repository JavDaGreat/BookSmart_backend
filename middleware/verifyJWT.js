const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.body.Authorization;
  if (!authHeader) return res.sendStatus(403);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded.username;

    next();
  });
};
module.exports = verifyJWT;
