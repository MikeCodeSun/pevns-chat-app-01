const router = require("express").Router();
const { getMessage, sendMessage } = require("../controllers/messageController");
const auth = require("../middlewares/auth");

router.route("/:to").get(auth, getMessage);
router.route("/:to").post(auth, sendMessage);

module.exports = router;
