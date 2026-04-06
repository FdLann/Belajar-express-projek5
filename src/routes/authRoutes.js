import e from "express";
import * as authController from "../controllers/authController.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { loginSchema, registerSchema } from "../validations/authValidation.js";
import { authLimiter } from "../middlewares/rateLimitMiddleware.js";

const router = e.Router();

router.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  authController.register,
);
router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.post("/refresh", authController.refresh); // ← baru
router.post("/logout", authController.logout); // ← baru

export default router;
