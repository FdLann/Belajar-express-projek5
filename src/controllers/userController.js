import * as userService from "../services/userServices.js";
import catchAsync from "../utils/catchAsync.js";

export const getAllUsers = catchAsync(async (req, res) => {
  const users = await userService.getAllUsers();
  res.json({ success: true, data: users });
});

export const getUserById = catchAsync(async (req, res) => {
  const user = await userService.getUserById(Number(req.params.id));
  if (!user)
    return res.status(404).json({ success: false, message: "user not found" });
  res.json({ success: true, data: user });
});

export const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(201).json({ success: true, data: user });
});

export const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUser(Number(req.params.id), req.body);
  res.json({ success: true, data: user });
});

export const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUser(Number(req.params.id));
  res.json({ success: true, message: "User Deleted" });
});

export const uploadAvatar = catchAsync(async (req, res) => {
  if (!req.file) throw new AppError("Please upload a file", 400);

  // req.file.path berisi path file yang baru disimpan
  const avatarUrl = `${req.file.path.replace(/\\/g, "/")}`; // normalize Windows path
  const user = await userService.updateAvatar(Number(req.params.id), avatarUrl);

  res.json({ success: true, data: user });
});
