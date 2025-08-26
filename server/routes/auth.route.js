import { Router } from "express";
import {
  Google,
  GoogleCallback,
  Login,
  Logout,
  Refresh,
  Signup,
} from "../controllers/auth.controller.js";
import { validateLogin, validateRegister } from "../middleware/validators.js";
import { authenticateJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", (req, res) => {
  res.send("Auth route");
});

router.post("/signup", validateRegister, Signup);
router.post("/login", Login);
router.get("/google", Google);
router.get("/google/callback", GoogleCallback);
router.post("/refresh", Refresh);
router.post("/logout", authenticateJWT, Logout);
router.get("/me", authenticateJWT, (req, res) => {
  res.json({ user: req.user, message: "User data fetched" });
});

export { router as authRouter };
