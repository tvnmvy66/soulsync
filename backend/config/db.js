import mongoose from "mongoose";

const mongoURI = process.env.MONGODB_URI;

async function connectDB() {
  try {
    await mongoose.connect(mongoURI);
    console.log('🍃db connected successfully!');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
}

export default connectDB;