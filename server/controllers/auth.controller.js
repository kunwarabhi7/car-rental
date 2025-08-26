import User from "../models/user.model.js";
import {
  generateToken,
  generateRefreshToken,
  refreshCookieOptions,
} from "../utills/token.js";
import passport from "passport";

export const Signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const newUser = new User({ username, email, password });
    const { plain: refreshTokenPlain, hashed: refreshTokenHashed } =
      await generateRefreshToken();
    newUser.refreshToken = refreshTokenHashed;
    await newUser.save();

    const token = generateToken(newUser);
    const {
      password: _,
      refreshToken: __,
      ...userWithoutSensitive
    } = newUser.toObject();

    res.cookie("refreshToken", refreshTokenPlain, refreshCookieOptions);
    return res.status(201).json({
      token,
      user: userWithoutSensitive,
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const Login = async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.password) {
      return res.status(400).json({ message: "Please login with Google" });
    }

    const isMatch = await user.isPasswordMatch(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    const { plain: refreshTokenPlain, hashed: refreshTokenHashed } =
      await generateRefreshToken();
    user.refreshToken = refreshTokenHashed;
    await user.save();

    const {
      password: _,
      refreshToken: __,
      ...userWithoutSensitive
    } = user.toObject();

    res.cookie("refreshToken", refreshTokenPlain, refreshCookieOptions);
    console.log("User from DB:", user);

    return res.status(200).json({
      token,
      user: userWithoutSensitive,
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const Google = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const GoogleCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, async (err, user) => {
    if (err || !user) {
      return res.redirect("http://localhost:3000/login?error=auth_failed");
    }

    try {
      const token = generateToken(user);
      const { plain: refreshTokenPlain, hashed: refreshTokenHashed } =
        await generateRefreshToken();
      user.refreshToken = refreshTokenHashed;
      await user.save();

      const {
        password: _,
        refreshToken: __,
        ...userWithoutSensitive
      } = user.toObject();

      res.cookie("refreshToken", refreshTokenPlain, refreshCookieOptions);
      res.redirect(`http://localhost:3000/auth/callback?token=${token}`);
    } catch (error) {
      res.redirect(
        `http://localhost:3000/login?error=${encodeURIComponent(error.message)}`
      );
    }
  })(req, res, next);
};

export const Refresh = async (req, res) => {
  try {
    const refreshTokenPlain = req.cookies.refreshToken;
    if (!refreshTokenPlain) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const user = await User.findOne({ refreshToken: { $ne: null } }).select(
      "+refreshToken"
    );
    if (!user || !user.refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const isValid = await bcrypt.compare(refreshTokenPlain, user.refreshToken);
    if (!isValid) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateToken(user);
    res.json({ token: newAccessToken, message: "Token refreshed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const Logout = async (req, res) => {
  try {
    const user = req.user;
    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.clearCookie("refreshToken", refreshCookieOptions);
    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
