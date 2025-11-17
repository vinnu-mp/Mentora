const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

// Register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.redirect("/signup?error=User+already+exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.redirect("/login?success=Account+created+successfully");
  } catch (err) {
    console.error(err);
    res.redirect("/signup?error=Server+error");
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.redirect("/login?error=User+not+found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.redirect("/login?error=Invalid+password");

    // Successful login: redirect to home/dashboard
    res.redirect("/home"); // change /home to your main dashboard/home page
  } catch (err) {
    console.error(err);
    res.redirect("/login?error=Server+error");
  }
});

module.exports = router;
