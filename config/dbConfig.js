import mongoose from "mongoose";

export const connectToDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/astro_predict`);
    console.log("DB connected successfully");
  } catch (err) {
    console.log(err);
  }
};
