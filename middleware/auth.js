const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (authHeader) {
    try {
      // Get token
      const token = authHeader.split(" ")[1];

      // Validate JWT
      const user = jwt.verify(token, process.env.SECRET);

      req.user = user;
    } catch (error) {
      return res.status(401).json({ message: "error" });
    }
  }

  return next();
};
