import bcrypt from "bcryptjs";
import * as userModel from "../model/userModel.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/token.js";
import AppError from "../utils/AppError.js";

export const register = async ({ name, email, password }) => {
  const existing = await userModel.findByEmail(email);
  if (existing) throw new AppError("Email already in use", 409);

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userModel.create({
    name,
    email,
    password: hashedPassword,
  });
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const login = async ({ email, password }) => {
  const user = await userModel.findByEmail(email);
  if (!user) throw new AppError("Invalid email or password", 401);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError("Invalid email or password", 401);

  const payload = { id: user.id, email: user.email, role: user.role };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // Simpan refresh token ke DB
  await userModel.updateRefreshToken(user.id, refreshToken);

  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, accessToken, refreshToken };
};

export const refresh = async (token) => {
  if (!token) throw new AppError("No refresh token", 401);

  // Verifikasi token valid
  const decoded = verifyRefreshToken(token);

  // Cek token ada di DB (belum di-logout)
  const user = await userModel.findByRefreshToken(token);
  if (!user) throw new AppError("Invalid refresh token", 403);

  // Buat access token baru
  const accessToken = signAccessToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  return { accessToken };
};

export const logout = async (token) => {
  if (!token) return; // sudah logout, tidak apa-apa
  // Hapus refresh token dari DB — token lama tidak bisa dipakai lagi
  const user = await userModel.findByRefreshToken(token);
  if (user) await userModel.updateRefreshToken(user.id, null);
};
