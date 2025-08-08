import jwt from "jsonwebtoken";
import config from "../config.js";

function userMiddleware(req, res, next) {
  let token;

  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }
  else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({ errors: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_USER_PASSWORD);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.log("❌ JWT Error:", error);
    return res.status(401).json({ errors: "Invalid token or expired" });
  }
}

export default userMiddleware;
