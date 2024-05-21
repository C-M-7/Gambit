const { error } = require("console");
const { getDB } = require("../Configs/mongoConnection");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
require("dotenv").config();

const handleSignUp = async (req, res) => {
  try {
    const db = await getDB();
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
      return res
        .status(400)
        .json({
          status: false,
          status_code: 400,
          error: "All fields are mandatory!",
        });
    }

    // Checking for existence of the user
    const existingUser = await db.collection("users").findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json({
          status: false,
          status_code: 400,
          error: "You are already a registered user, Please proceed to SignIn",
        });
    }

    // Checking for the availability of username
    const usernameExists = await db
      .collection("users")
      .findOne({ username: username });
    if (usernameExists) {
      return res
        .status(400)
        .json({
          status: false,
          status_code: 400,
          error: "Username already exists please try another.",
        });
    }

    // Hashing the password
    const sha256 = crypto.createHash("sha256");
    sha256.update(String(password), "utf-8");
    const hashedPassword = sha256.digest("hex");

    // Insert UserDetails in the db
    const newUser = await db.collection("users").insertOne({
      username: username,
      name: name,
      email: email,
      password: hashedPassword,
    });
    return res
      .status(200)
      .json({ status: true, status_code: 200, user: newUser });
  } catch (err) {
    return res
      .status(400)
      .json({ status: false, status_code: 400, error: err.message });
  }
};

const handleSignIn = async (req, res) => {
  try {
    const db = await getDB();
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({
          status: false,
          status_code: 400,
          error: "All fields are mandatory!",
        });
    }

    // Check if the user exists in db or not
    const existingUser = await db.collection("users").findOne({ email: email });
    if (!existingUser) {
      return res
        .status(400)
        .json({
          status: false,
          status_code: 400,
          error: "You havent register please SignUp first!",
        });
    }

    // Checking the password
    const sha256 = crypto.createHash("sha256");
    sha256.update(String(password), "utf-8");
    const hashedPassword = sha256.digest("hex");

    if (hashedPassword === existingUser.password) {
      const token = jwt.sign(
        {
          email: existingUser.email,
          userId: new ObjectId(existingUser._id),
        },
        process.env.jwt_secret_key,
        { expiresIn: "15d" }
      );
      await db
        .collection("users")
        .updateOne(
          { _id: existingUser._id },
          { $set: { loginToken: token.toString() } }
        );
      existingUser.loginToken = token;
      return res.status(200).json(existingUser);
    } else {
      return res
        .status(400)
        .json({ status: false, status_code: 400, error: "Invalid Password!" });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ status: false, status_code: 400, error: err.message });
  }
};

module.exports = {
  handleSignUp,
  handleSignIn,
};
