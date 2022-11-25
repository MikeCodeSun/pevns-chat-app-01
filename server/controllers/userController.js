const pool = require("../db/db");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// check user input username & password
const checkUserInputValidator = (username, password) => {
  const errs = {};
  if (!username || username.trim() === "")
    errs.username = "username must not be empty!";
  if (!password) errs.password = "password must not be empty!";
  return {
    valid: Object.keys(errs).length === 0,
    errs,
  };
};

// util userinpit validator!
const register = async (req, res) => {
  const { username, password } = req.body;
  let errors = {};
  try {
    // check user input is valid
    const { valid, errs } = checkUserInputValidator(username, password);
    if (!valid) {
      errors = errs;
      throw errors;
    }
    // check password more 6
    if ([...password].length < 6) {
      errors.password = "passwrod must more than 6";
      throw errors;
    }

    // hash password
    const hashPassword = await bcryptjs.hash(password, 8);
    // insert user input into database
    await pool.query("INSERT INTO USERS (username, password) VALUES($1, $2)", [
      username,
      hashPassword,
    ]);
    //
    res.status(200).json({ status: true, msg: "Register successfully!" });
  } catch (error) {
    console.log(error);
    if (error.code === "23505") {
      errors.usernmae = "username already register, please change another one";
    }
    res.status(500).json({ status: false, msg: errors });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  let errors = {};
  try {
    // check user input is valid
    const { valid, errs } = checkUserInputValidator(username, password);
    if (!valid) {
      errors = errs;
      throw errors;
    }
    // select username from database
    const userData = await pool.query("SELECT * FROM users WHERE username=$1", [
      username,
    ]);
    // check user is already exist ?
    if (userData.rowCount === 0) {
      errors.username = "user not exist please register";
      throw errors;
    }
    // check user password is right
    const isValidPassword = await bcryptjs.compare(
      password,
      userData.rows[0].password
    );
    // console.log(isValidPassword);
    if (!isValidPassword) {
      errors.password = "password not right";
      throw errors;
    }
    // generate jwt token
    const token = jwt.sign(
      { id: userData.rows[0].id, username: userData.rows[0].username },
      process.env.SECRET,
      { expiresIn: "1d" }
    );
    // set cookie
    res.cookie("token", token, {
      domain: "localhost",
      path: "/",
      maxAge: 3600 * 1000 * 24,
      httpOnly: false,
      secure: false,
      sameSite: false,
    });
    res.status(200).json({ status: true, msg: "login successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, msg: errors });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      domain: "localhost",
      path: "/",
      maxAge: 0,
      httpOnly: true,
      secure: false,
      sameSite: true,
    });
    res.status(200).json({ msg: "log out successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "something went wrong!" });
  }
};

const getUsers = async (req, res) => {
  const user = res.locals.user;
  try {
    const usersData = await pool.query(
      "SELECT DISTINCT u.* FROM users u INNER JOIN message m ON u.id = m.message_to OR u.id = m.message_from WHERE (m.message_from = $1 OR m.message_to = $1) AND u.id != $1",
      [user.id]
    );
    res.status(200).json(usersData.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong!" });
  }
};

// search user
const searchUser = async (req, res) => {
  const { user } = res.locals;
  const { username } = req.params;
  try {
    const usersData = await pool.query(
      "SELECT * FROM users WHERE username like '%' || $1 || '%' AND id != $2 ",
      [username, user.id]
    );
    res.status(200).json(usersData.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "something went wrong!" });
  }
};

module.exports = { register, login, logout, getUsers, searchUser };
