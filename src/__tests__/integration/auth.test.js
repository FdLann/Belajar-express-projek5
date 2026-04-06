import request from "supertest";
import app from "../../app.js";

describe("POST /api/auth/register", () => {
  it("should register successfully with valid data", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Budi", email: "budi@test.com", password: "secret123" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).not.toHaveProperty("password");
  });

  it("should return 400 with invalid email", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Budi", email: "bukan-email", password: "secret123" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/valid email/i);
  });

  it("should return 400 with missing fields", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "budi@test.com" }); // name & password tidak ada

    expect(res.status).toBe(400);
  });
});

describe("POST /api/auth/login", () => {
  it("should login and return accessToken", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "budi@test.com", password: "secret123" });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("accessToken");
    expect(res.headers["set-cookie"]).toBeDefined(); // cookie refresh token harus ada
  });

  it("should return 401 on wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "budi@test.com", password: "salah" });

    expect(res.status).toBe(401);
  });
});
