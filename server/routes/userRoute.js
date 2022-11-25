const {
  register,
  login,
  logout,
  getUsers,
  searchUser,
} = require("../controllers/userController");
const router = require("express").Router();
const auth = require("../middlewares/auth");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/getusers").get(auth, getUsers);
router.route("/searchusers/:username").get(auth, searchUser);

module.exports = router;
