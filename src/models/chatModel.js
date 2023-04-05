import mongoose, { Schema } from "mongoose";

const chatSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Person",
  },
  role: {
    type: String,
    required: [true, "Role is required"],
  },
  message: {
    type: String,
    required: [true, "Message is required"],
  },
});

export const Chat = mongoose.model("Chat", chatSchema);
