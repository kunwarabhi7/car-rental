import express from "express";
import { connectToDB } from "./utills/connectToDB.js";
import { configDotenv } from "dotenv";
configDotenv();
const PORT = process.env.PORT || 5000;
const app = express();

app.get("/", (req, res) => {
  res.status(200).json({ message: "Car Rental is running fine" });
});

const server = async () => {
  await connectToDB();

  app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
  });
};

server();
