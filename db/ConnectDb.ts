import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    return await mongoose.connect(process.env.MONGO_URI ?? "");
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
};
