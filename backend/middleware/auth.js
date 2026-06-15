import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const headerToken = req.headers.token;
  const authHeader = req.headers.authorization;
  const bearer =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;
  const token = headerToken || bearer;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not Authorized Login Again",
    });
  }
  try {
    const jwtSecret = process.env.JWT_SECRET || "dev_jwt_secret_change_me";
    const token_decode = jwt.verify(token, jwtSecret);
    req.body.userId = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
export default authMiddleware;
