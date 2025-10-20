const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET_KEY } = process.env;

const tokenAuthentication = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token is not valid" });
    }

    req.id = user.id;
    req.email = user.email;
    req.role = user.role;

    next();
  });
};
module.exports = { tokenAuthentication };
