const { Router } = require("express");
const userRouter = Router();
const User = require("../models/User");
const { hash, compare } = require("bcryptjs");

const mongoose = require("mongoose");

userRouter.post("/register", async (req, res) => {
  try {
    if (req.body.username.length < 3)
      throw new Error("Please make username longer than 3 charactors");
    if (req.body.password.length < 6)
      throw new Error("Please make password longer than 6 charactors");
    const hashedPassword = await hash(req.body.password, 10);
    await new User({
      name: req.body.name,
      username: req.body.username,
      hashedPassword,
    }).save();
    res.json({ message: "user registered" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.patch("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    const isValid = await compare(req.body.password, user.hashedPassword);
    if (!isValid) throw new Error("Information is not correct");
    user.sessions.push({ createdAt: new Date() });
    const session = user.sessions(user.sessions.length - 1);
    await user.save();
    res.json({
      message: "user validated",
      sessionId: session._id,
      name: user.name,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

userRouter.patch("/logout", async (req, res) => {
  try {
    console.log(req.user);
    if (!req.user) throw new Error("invalid sessionId");
    await User.updateOne(
      { _id: user.id },
      { $pull: { sessions: { _id: req.headers.sessionid } } }
    );
    res.json({ message: "user is logged out." });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = { userRouter };
