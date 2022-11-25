const pool = require("../db/db");

// 1118 select message from each others!
const getMessage = async (req, res) => {
  const { user } = res.locals;
  const { to } = req.params;
  // console.log(user);
  // console.log(to);
  try {
    const toUserData = await pool.query("SELECT * FROM users WHERE id = $1", [
      to,
    ]);
    if (toUserData.rowCount === 0) {
      throw new Error("No User exist");
    }
    // const messageData = await pool.query(
    //   "SELECT * FROM message WHERE (message_from = $1 AND message_to = $2) OR (message_from=$2 AND message_to=$1)",
    //   [user.id, to]
    // );
    const messageData = await pool.query(
      "SELECT m.*, u.username as uname FROM message m LEFT JOIN users u ON m.message_from = u.id WHERE (message_from = $1 AND message_to = $2) OR (message_from=$2 AND message_to=$1)",
      [user.id, to]
    );
    console.log(messageData.rows);
    res.status(200).json(messageData.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};
// not usefull
const sendMessage = async (req, res) => {
  const { content } = req.body;
  const { to } = req.params;
  const { user } = res.locals;
  const errors = {};
  console.log(to, content, user.id);
  try {
    // check message content
    if (!content || content.trim() === "") {
      errors.content = "Message Content must not be empty";
      throw errors;
    }
    // check message to user
    const toUserData = await pool.query("SELECT * FROM users WHERE id=$1", [
      to,
    ]);
    if (toUserData.rowCount === 0) {
      errors.to = "Send Message to user not exit";
      throw errors;
    }
    // check user send message
    const fromUserData = await pool.query("SELECT * FROM users WHERE id=$1", [
      user.id,
    ]);
    if (fromUserData.rowCount === 0) {
      errors.to = "User Send Message not exit";
      throw errors;
    }
    // save message to database
    const messageData = await pool.query(
      "INSERT INTO message (content,message_from, message_to) VALUES($1, $2, $3)",
      [content, user.id, to]
    );
    console.log(messageData.rows[0]);
    res.status(200).json({ msg: "send msg" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "send err" });
  }
};

module.exports = { getMessage, sendMessage };
