const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
require("dotenv").config();

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("Mentora Backend Running");
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// -------- ROUTES --------
app.get("/login", (req, res) => {
  res.render("login", {
    error: req.query.error,
    success: req.query.success,
  });
});
app.get("/signup", (req, res) => {
  res.render("signup", {
    error: req.query.error,
    success: req.query.success,
  });
});

app.post("/signup", (req, res) => {
  // Store user data later with DB
  res.redirect("/");
});

app.get("/profile", (req, res) => {
  const user = {
    name: "John Doe",
    email: "john@example.com",
    age: 21,
    gender: "Male",
    weeklyReport:
      "You had a balanced week. Anxiety levels decreased compared to last week and mood stability improved.",
  };

  res.render("profile.ejs", { user });
});

app.get("/home", (req, res) => {
  res.render("home.ejs");
});

app.get("/pricing", (req, res) => {
  res.render("pricing.ejs");
});

app.get("/chat", (req, res) => {
  res.render("chat.ejs"); // your chat.ejs page
});

app.get("/therapists", (req, res) => res.render("therapists"));
app.get("/profile", (req, res) => res.render("profile"));

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
