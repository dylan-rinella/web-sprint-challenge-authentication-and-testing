const jwt = require("jsonwebtoken");

function restrict() {
  return async (req, res, next) => {
    const authDenied = {
      message: "invalid credentials",
    }
    try {
      const token = req.header.authorization;
      if (!token) {
        return res.status(401).json(authDenied);
      }
      jwt.verify(token, process.env.JWT_VERIFY, (err, decode) => {
        if (err) {
          return res.status(401).json(authDenied);
        }
        req.token = decode;
        next();
      })
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { restrict };
