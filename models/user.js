import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  uid: String,
  firstName: String,
  lastName: String,
  email: String,
  profilePictureUrl: String,
  emailVerified: Boolean,
  createdAt: {
    type: Date,
    // default: Date.now,
  },
  updatedAt: {
    type: Date,
    // default: Date.now,
  },
  lastSignInAt: {
    type: Date,
    // default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
