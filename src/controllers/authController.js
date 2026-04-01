import * as authService from "../services/authService.js";
import catchAsync from "../utils/catchAsync.js";

const COOKIE_OPTIONS = {
  httpOnly: true, // tidak bisa diakses JS di browser
  secure: process.env.NODE_ENV === "production", // HTTPS only di production
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari dalam milidetik
};

export const register = catchAsync(async (req, res) => {
  const user = await authService.register(req.body);
  res.status(201).json({ success: true, data: user });
});

export const login = catchAsync(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);

  // Refresh token → httpOnly cookie (tidak terlihat di JS)
  res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

  // Access token → dikirim di body, disimpan di memory/state frontend
  res.json({ success: true, data: { user, accessToken } });
});

export const refresh = catchAsync(async (req, res) => {
  const token = req.cookies.refreshToken; // ambil dari cookie
  const { accessToken } = await authService.refresh(token);
  res.json({ success: true, data: { accessToken } });
});

export const logout = catchAsync(async (req, res) => {
  const token = req.cookies.refreshToken;
  await authService.logout(token);

  res.clearCookie("refreshToken", COOKIE_OPTIONS);
  res.json({ success: true, message: "Logged out successfully" });
});
