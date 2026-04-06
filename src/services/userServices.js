import * as userModel from "../model/userModel.js";
import AppError from "../utils/AppError.js";
import { buildPaginatedResponse, getPagination } from "../utils/pagination.js";

export const getAllUsers = async (query) => {
  const { page, limit, skip } = getPagination(query);

  const where = {};

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: "insensitive" } },
      { email: { contains: query.search, mode: "insensitive" } },
    ];
  }

  if (query.role) {
    where.role = query.role;
  }

  const [data, total] = await Promise.all([
    userModel.findAll({ skip, limit, where }),
    userModel.countAll(where),
  ]);

  return buildPaginatedResponse({ data, total, page, limit });
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
