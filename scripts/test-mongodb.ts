import connectMongoDB from "../lib/mongodb/connect";

async function testConnection() {
  try {
    await connectMongoDB();
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

testConnection();