const { exception } = require("console");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    let role = req.userData.role;
    if (role && role == "admin") next();
    else throw exception();
  } catch (error) {
    res.status(401).json({ message: "You have no permission!" });
  }
};

module.exports.checkPermission = (token) => {
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    let userData = {
      username: decodedToken.username, // GEÄNDERT: email -> username
      userId: decodedToken.userId,
      role: decodedToken.role,
    };

    if (userData.role && userData.role == "admin")
      return {
        hasPermission: true,
        message: "User has permission.", // KORRIGIERT: Tippfehler
      };
    else
      return {
        hasPermission: false,
        message: "Insufficient permission.",
      };
  } catch (error) {
    return {
      hasPermission: false,
      message: error.message,
    };
  }
};
