import * as userModel from "../model/userModel.js";
import AppError from "../utils/AppError.js";

export const getAllUsers = async () => {
  return userModel.findAll();
};

export const getUserById = async (id) => {
  return userModel.findById(id);
};

export const createUser = async (data) => {
  const { name, email } = data;

  //validasi apakah data kosong atau ada
  if (!name || !email) throw new Error("Name and email are required");

  const existing = await userModel.findByEmail(email);
  if (existing) throw new AppError("Email already in use", 409);

  return userModel.create({ name, email });
};

export const updateUser = async (id, data) => {
  //pastikan user ada
  const user = await userModel.findById(id);
  if (!user) throw new AppError("User not found", 404);

  return userModel.update(id, data);
};

export const deleteUser = async (id) => {
  const user = await userModel.findById(id);
  if (!user) throw new AppError("User not found", 404);

  return userModel.remove(id);
};

export const updateAvatar = async (id, avatarUrl) => {
  const user = await userModel.findById(id);
  if (!user) throw new AppError("User not found", 404);

  return userModel.update(id, { avatar: avatarUrl });
};
