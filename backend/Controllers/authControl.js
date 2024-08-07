const { error } = require("console");
const { getDB } = require("../Configs/mongoConnection");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
require("dotenv").config();
// const Cookies = require('js-cookie');

const generateAccessToken = async (username, email) => {
  try {
    const accessToken = jwt.sign(
      {
        username: username,
        email: email,
      },
      process.env.jwt_secret_key,
      { expiresIn: "1d" }
    );
    return accessToken.toString();
  } catch (err) {
    return false;
  }
};

const generateRefreshToken = async (username, email) => {
  try {
    const refreshToken = jwt.sign(
      {
        username: username,
        email: email,
      },
      process.env.jwt_secret_key,
      { expiresIn: "15d" }
    );
    const accessToken = await generateAccessToken(username, email);
    if (accessToken.length === 0) {
      return null;
    }

    const db = await getDB();
    const response = await db
      .collection("users")
      .updateOne(
        { email: email },
        { $set: { loginToken: refreshToken.toString() } }
      );

    return {
      refreshToken,
      accessToken,
    };
  } catch (err) {
    return false;
  }
};

const generateAccessTokenOnly = async (req, res) => {
  try {
    const db = await getDB();
    const cookies = req.cookies;
    const refreshToken = cookies["refreshAuthToken"];

    if (!refreshToken) {
      return res.status(401).json({
        status: false,
        status_code: 401,
        error: "Token not found, SignIn again!",
      });
    }

    const existingUser = await db
      .collection("users")
      .findOne({ loginToken: refreshToken });

    if (!existingUser) {
      return res.status(401).json({
        status: false,
        status_code: 401,
        error: "Token Expired/Invalid, SignIn again!",
      });
    }

    const accessToken = await generateAccessToken(
      existingUser.username,
      existingUser.email
    );

    if (!accessToken)
      return res.status(500).json({
        status: false,
        status_code: 500,
        error: "Internal Server Error",
      });

    return res.status(200).json({
      status: true,
      status_code: 200,
      accessToken: accessToken,
      user: {
        username: existingUser.username,
        email: existingUser.email,
        name: existingUser.name,
      },
    });
  } catch (err) {
    return res
      .status(401)
      .json({ status: false, status_code: 401, error: err.message });
  }
};

const handleSignUp = async (req, res) => {
  try {
    const db = await getDB();
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
      return res.status(400).json({
        status: false,
        status_code: 400,
        error: "All fields are mandatory!",
      });
    }

    // Checking for existence of the user
    const existingUser = await db.collection("users").findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
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
      return res.status(400).json({
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
      return res.status(400).json({
        status: false,
        status_code: 400,
        error: "All fields are mandatory!",
      });
    }

    // Check if the user exists in db or not
    const existingUser = await db.collection("users").findOne({ email: email });
    if (!existingUser) {
      return res.status(400).json({
        status: false,
        status_code: 400,
        error: "You havent register please SignUp first!",
      });
    }

    // Checking the password
    const sha256 = crypto.createHash("sha256");
    sha256.update(String(password), "utf-8");
    const hashedPassword = sha256.digest("hex");

    const cookies = req.cookies;

    if (hashedPassword === existingUser.password) {
      const tokens = await generateRefreshToken(
        existingUser.username,
        existingUser.email
      );
      const { refreshToken, accessToken } = tokens;
      existingUser.loginToken = refreshToken;

      res.cookie("refreshAuthToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      });

      return res.status(200).json({
        status: true,
        status_code: 200,
        user: {
          username: existingUser.username,
          email: existingUser.email,
          name: existingUser.name,
        },
        accessToken: accessToken,
      });
    }
  } catch (err) {
    return res
      .status(401)
      .json({ status: false, status_code: 401, error: err.message });
  }
};

const deleteRefreshToken = async (req, res) => {
  try {
    const db = await getDB();
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: false,
        status_code: 400,
        error: "Invalid Request, Please try again!",
      });
    }

    const response = await db
      .collection("users")
      .updateOne({ email: email }, { $unset: { loginToken: "" } });

    if (!response) {
      return res.status(500).json({
        status: false,
        status_code: 500,
        error: "Internal Server Error",
      });
    }

    return res.status(200).json({
      status: true,
      status_code: 200,
    });
  } catch (err) {
    return res.status(400).json({
      status: false,
      status_code: 400,
      error: "Invalid Request, Please try again!",
    });
  }
};

module.exports = {
  handleSignUp,
  handleSignIn,
  generateAccessToken,
  generateRefreshToken,
  generateAccessTokenOnly,
  deleteRefreshToken,
};
