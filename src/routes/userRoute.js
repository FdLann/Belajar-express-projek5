import * as userController from "../controllers/userController.js";
import { Router } from "express";
import {
  ownDataOnly,
  protect,
  restrictTo,
} from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import { validate, validateParams } from "../middlewares/validateMiddleware.js";
import {
  idParamSchema,
  updateUserSchema,
} from "../validations/userValidation.js";

const router = Router();

router.use(protect);

router.get("/", restrictTo("admin"), userController.getAllUsers);
router.get("/:id", validateParams(idParamSchema), userController.getUserById);
router.post("/", restrictTo("admin"), userController.createUser);
router.put(
  "/:id",
  ownDataOnly,
  validate(updateUserSchema),
  userController.updateUser,
);
router.delete(
  "/:id",
  ownDataOnly,
  restrictTo("admin"),
  userController.deleteUser,
);

// route upload avatar yang benar
router.patch(
  "/:id/avatar",
  ownDataOnly,
  upload.single("avatar"),
  userController.uploadAvatar,
);
export default router;
