import mongoose, { Schema } from "mongoose";

const personSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: [true, "name is required"],
  },
  birth_date: {
    type: new Schema({
      day: {
        type: String,
        required: [true, "Day is required"],
      },
      month: {
        type: String,
        required: [true, "Month is required"],
      },
      year: {
        type: String,
        required: [true, "Year is required"],
      },
      hours: {
        type: String,
        required: [true, "Hours is required"],
      },
      minutes: {
        type: String,
        required: [true, "Minutes is required"],
      },
    }),
    required: [true, "Birth date is required"],
  },
  birth_location: {
    type: String,
    required: [true, "Birth location is required"],
  },
});

export const Person = mongoose.model("Person", personSchema);
