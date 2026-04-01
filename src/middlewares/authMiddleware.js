import { verifyToken } from "../utils/token.js";
import AppError from "../utils/AppError.js";
import * as userModel from "../model/userModel.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("No token provided", 401));
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await userModel.findById(decoded.id);
    if (!user) return next(new AppError("User no longer exists", 401));

    req.user = user;
    next();
  } catch (error) {
    next(new AppError("Invalid or expired token", 401));
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action"),
      );
    }
    next();
  };
};

export const ownDataOnly = (req, res, next) => {
  const targetId = Number(req.params.id);
  const isOwner = req.user.id === targetId;
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return next(new AppError("You can only access your own data"), 403);
  }
};
