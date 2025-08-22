import express from "express";
import { connectToDB } from "./utills/connectToDB.js";
import { configDotenv } from "dotenv";
import { authRouter } from "./routes/auth.route.js";
import cors from "cors";
import passport from "passport";

configDotenv();
const PORT = process.env.PORT || 5000;
const app = express();

// Middlewares
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(passport.initialize());

// Health check
app.get("/", (req, res) => {
  res.status(200).json({ message: "Car Rental API is running" });
});

// Routes
app.use("/api/auth", authRouter);

const server = async () => {
  try {
    await connectToDB();

    app.listen(PORT, () => {
      console.log(`App is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

server();
