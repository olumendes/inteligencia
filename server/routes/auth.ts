import { RequestHandler } from "express";
import { LoginRequest, LoginResponse, UserInfo } from "@shared/api";

// Test user
const TEST_USER = {
  id: "user-001",
  email: "oluanmendes@gmail.com",
  password: "Lu040768!",
  name: "Oluam Mendes",
  createdAt: "2024-01-15",
  plan: "premium",
  status: "active",
};

// In-memory session store (in production, use proper session management)
const sessions = new Map<string, { userId: string; expiresAt: number }>();

export const handleLogin: RequestHandler = (req, res) => {
  const { email, password } = req.body as LoginRequest;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    } as LoginResponse);
  }

  if (email === TEST_USER.email && password === TEST_USER.password) {
    // Create session
    const sessionId = Math.random().toString(36).substr(2, 9);
    sessions.set(sessionId, {
      userId: TEST_USER.id,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: TEST_USER.id,
        email: TEST_USER.email,
        name: TEST_USER.name,
      },
    } as LoginResponse);
  }

  return res.status(401).json({
    success: false,
    message: "Invalid email or password",
  } as LoginResponse);
};

export const handleGetUserInfo: RequestHandler = (req, res) => {
  const email = req.query.email as string;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  if (email === TEST_USER.email) {
    const userInfo: UserInfo = {
      id: TEST_USER.id,
      email: TEST_USER.email,
      name: TEST_USER.name,
      createdAt: TEST_USER.createdAt,
      plan: TEST_USER.plan,
      status: TEST_USER.status,
    };
    return res.status(200).json(userInfo);
  }

  return res.status(404).json({ error: "User not found" });
};
