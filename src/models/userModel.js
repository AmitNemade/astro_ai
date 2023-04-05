import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  persons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Person" }],
});

export const User = mongoose.model("User", userSchema);
