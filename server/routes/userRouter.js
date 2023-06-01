const { Router } = require("express");
const userRouter = Router();
const User = require("../models/User");
const { hash, compare } = require("bcryptjs"); // hash function
const mongoose = require("mongoose");

userRouter.post("/register", async (req, res) => {
  try {
    if (req.body.username.length < 3)
      throw new Error("Make the username longer than 3 characters");
    if (req.body.password.length < 6)
      throw new Error("Make the password longer than 6 characters");

    const hashedPassword = await hash(req.body.password, 10);

    const user = await new User({
      name: req.body.name,
      username: req.body.username,
      hashedPassword,
      sessions: [{ createdAt: new Date() }],
    }).save(); // raw (JSON)

    const session = user.sessions[0];

    res.json({
      message: "User registered",
      sessionId: session._id,
      name: user.name,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.patch("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    const isValid = await compare(req.body.password, user.hashedPassword);
    if (!isValid) throw new Error("Invalid Information");

    user.sessions.push({ createdAt: new Date() });
    await user.save();

    const session = user.sessions[user.sessions.length - 1];
    console.log(session);

    res.json({
      message: "User Validated",
      sessionId: session._id,
      name: user.name,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.patch("/logout", async (req, res) => {
  try {
    if (!req.user) throw new Error("Invalid Session ID");
    await User.updateOne(
      { _id: req.user.id },
      {
        $pull: { sessions: { _id: req.headers.sessionid } },
      }
    );
    res.json({ message: "User is logged out" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = { userRouter };
