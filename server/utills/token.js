import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";

const ACCESS_EXPIRES = "15m";
const REFRESH_EXPIRES_DAYS = 7;

export const generateToken = (user) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: ACCESS_EXPIRES,
    }
  );
  return token;
};

export const generateRefreshToken = async () => {
  const plain = crypto.randomBytes(64).toString("hex");
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(plain, salt);
  return { plain, hashed };
};

//cookie options
export const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  path: "/api/auth/refresh",
  maxAge: 1000 * 60 * 60 * 24 * REFRESH_EXPIRES_DAYS,
};
