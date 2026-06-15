import userModel from "../models/userModel.js";

/**
 * Requires authMiddleware first (sets req.body.userId from JWT).
 */
const adminMiddleware = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.body.userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

export default adminMiddleware;
