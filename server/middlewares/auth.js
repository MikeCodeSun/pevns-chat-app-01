const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  // console.log(req.headers.cookie);
  if (!req.headers.cookie) {
    res.status(500).json({ msg: "NO Token cookie" });
    return;
  }
  // console.log(req.headers.cookie.split("=")[1]);
  const token = req.headers.cookie.split("=")[1];
  try {
    const decode = jwt.verify(token, process.env.SECRET);
    // console.log(decode);
    res.locals.user = decode;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "auth failed" });
  }
};
