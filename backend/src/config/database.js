import mongoose from "mongoose"

export const connectDB = async () =>{
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected Successfully");
  } catch (error) {
    console.log("Connected Error");
    process.exit(1);
  }
}