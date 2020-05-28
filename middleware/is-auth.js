const jwt = require("jsonwebtoken");
module.exports = (req, _, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    req.isAuth = false;
    return next();
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, "asecretthatcannotbeshared");
  } catch (err) {
    req.isAuth = false;
    return next(err);
  }

  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
};
