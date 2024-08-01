const { getDB } = require("../Configs/mongoConnection");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleUserInfo = async (req, res) => {
  try {
    const { token } = req.body;

    const cookies = req.cookies;
    const refreshToken = cookies["refreshAuthToken"];

    if (!refreshToken) {
      return res.status(401).json({
        status: false,
        status_code: 401,
        error: "Token not found, SignIn again!",
      });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, String(process.env.jwt_secret_key));

    if (!decoded) {
      return res.status(401).json({
        status: false,
        status_code: 401,
        error: "User doesn't exist",
      });
    }

    return res.status(200).json({
      status: true,
      status_code: 200,
      user: {
        username: decoded.username,
        email: decoded.email,
      },
    });
  } catch (err) {
    return res.status(403).json({
      status: false,
      status_code: 403,
      message: "Invalid Token",
    });
  }
};

const handleUserLogs = async (req, res) => {
  try {
    const db = await getDB();
    const { email, pageNum } = req.body;

    const user = await db.collection("users").findOne({ email: email });

    if (!user) {
      return res.status(400).json({
        status: false,
        status_code: 400,
        error: "User doesn't exist",
      });
    }

    const start = (pageNum-1)*5;
    const end = pageNum*5;

    const logs = await db
      .collection("games")
      .find({
        $or: [{ player1: email }, { player2: email }],
      })
      .skip(parseInt(start))
      .limit(parseInt(end) - parseInt(start))
      .toArray();

    if (logs.length === 0) {
      return res.status(400).json({
        status: false,
        status_code: 400,
        error: "No Logs",
      });
    }

    return res.status(200).json({
      status: true,
      status_code: 200,
      logs: logs,
    });
  } catch (err) {
    return res
      .status(400)
      .json({ status: false, status_code: 400, error: err.message });
  }
};

module.exports = {
  handleUserInfo,
  handleUserLogs,
};
