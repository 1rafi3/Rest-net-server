import * as jose from "jose";
import bcrypt from "bcryptjs";
import { Request } from "express";
import { db, User } from "./db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_super_secret_key_rentnest_2026_co-living_platform"
);

// Hashing helpers
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// JWT Sign / Verify
export async function signToken(payload: { userId: string; email: string; role: string }): Promise<string> {
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // 7 days expiration
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<{ userId: string; email: string; role: string } | null> {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    return payload as { userId: string; email: string; role: string };
  } catch (error) {
    return null;
  }
}

// Extract token from request cookie or auth header (Express compatible)
export async function getAuthenticatedUser(req: Request): Promise<User | null> {
  try {
    // 1. Check cookies (via cookie-parser middleware)
    let token = req.cookies?.token;

    // 2. Check Authorization header
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) return null;

    const payload = await verifyToken(token);
    if (!payload) return null;

    const user = db.getUserById(payload.userId);
    if (!user) return null;

    return user;
  } catch (error) {
    console.error("Auth helper error:", error);
    return null;
  }
}
