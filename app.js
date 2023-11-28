require("dotenv").config();
require("./database/db");
const express = require("express");
const app = express();
const cors = require("cors");
const chalk = require("chalk");
const userRoutes = require("./routes/userRoutes");
const customerRoutes = require("./routes/customerRoutes");

// Change origin
app.use(
  cors({
    origin: "http://localhost:5173"
    // credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(userRoutes);
app.use(customerRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Home Route" });
});

// 404 - page not found error handler
app.use((req, res, next) => {
  res.json({ Message: "Route not found" });
});

// server side error handler
app.use((err, req, res, next) => {
  if (err.message) {
    if (!req.headersent) {
      res.json({ Message: err.message });
    } else {
      res.json({ Message: "There is a server side error" });
    }
  }
});

module.exports = app;
