import { jest } from "@jest/globals";

// Mock semua dependency sebelum import service
jest.mock("../../model/userModel.js");
jest.mock("bcryptjs");

import * as authService from "../../services/authService.js";
import * as userModel from "../../model/userModel.js";
import bcrypt from "bcryptjs";

describe("authService", () => {
  // Reset semua mock sebelum tiap test
  beforeEach(() => jest.clearAllMocks());

  // ─── register ───────────────────────────────────────────
  describe("register", () => {
    it("should register a new user successfully", async () => {
      userModel.findByEmail.mockResolvedValue(null); // email belum ada
      bcrypt.hash.mockResolvedValue("hashed_password");
      userModel.create.mockResolvedValue({
        id: 1,
        name: "Budi",
        email: "budi@email.com",
        role: "user",
        password: "hashed_password",
      });

      const result = await authService.register({
        name: "Budi",
        email: "budi@email.com",
        password: "secret123",
      });

      expect(result).not.toHaveProperty("password"); // password tidak boleh keluar
      expect(result.email).toBe("budi@email.com");
      expect(userModel.create).toHaveBeenCalledTimes(1);
    });

    it("should throw 409 if email already in use", async () => {
      userModel.findByEmail.mockResolvedValue({
        id: 1,
        email: "budi@email.com",
      });

      await expect(
        authService.register({
          name: "Budi",
          email: "budi@email.com",
          password: "secret123",
        }),
      ).rejects.toMatchObject({ statusCode: 409 });
    });
  });

  // ─── login ──────────────────────────────────────────────
  describe("login", () => {
    it("should return tokens on valid credentials", async () => {
      userModel.findByEmail.mockResolvedValue({
        id: 1,
        email: "budi@email.com",
        password: "hashed",
        role: "user",
      });
      bcrypt.compare.mockResolvedValue(true);
      userModel.updateRefreshToken.mockResolvedValue({});

      const result = await authService.login({
        email: "budi@email.com",
        password: "secret123",
      });

      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
      expect(result.user).not.toHaveProperty("password");
    });

    it("should throw 401 on wrong password", async () => {
      userModel.findByEmail.mockResolvedValue({
        id: 1,
        email: "budi@email.com",
        password: "hashed",
        role: "user",
      });
      bcrypt.compare.mockResolvedValue(false); // password salah

      await expect(
        authService.login({ email: "budi@email.com", password: "wrongpass" }),
      ).rejects.toMatchObject({ statusCode: 401 });
    });

    it("should throw 401 if user not found", async () => {
      userModel.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login({ email: "tidakada@email.com", password: "secret" }),
      ).rejects.toMatchObject({ statusCode: 401 });
    });
  });
});
