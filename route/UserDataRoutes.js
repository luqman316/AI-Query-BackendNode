import express, { Router } from "express";
import User from "../models/user.js";

const router = express.Router();

router.post("/user", async (req, res) => {
  try {
    const {
      uid,
      firstName,
      lastName,
      email,
      profilePictureUrl,
      emailVerified,
      createdAt,
      updatedAt,
      lastSignInAt,
    } = req.body;

    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      existingUser.firstName = firstName;
      existingUser.lastName = lastName;
      existingUser.email = email;
      existingUser.profilePictureUrl = profilePictureUrl;
      existingUser.emailVerified = emailVerified;
      existingUser.updatedAt = updatedAt || new Date();
      existingUser.lastSignInAt = lastSignInAt || new Date();
      await existingUser.save();
      return res
        .status(200)
        .json({ message: "User updated successfully", user: existingUser });
    }

    const newUser = new User({
      uid,
      firstName,
      lastName,
      email,
      profilePictureUrl,
      emailVerified,
      createdAt: createdAt || new Date(),
      updatedAt: updatedAt || new Date(),
      lastSignInAt: lastSignInAt || new Date(),
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
