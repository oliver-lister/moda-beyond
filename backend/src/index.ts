import "dotenv/config";
import jwt from "jsonwebtoken";
import multer from "multer";
import express from "express";
import path from "path";
import cors from "cors";

const app = express();
const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
