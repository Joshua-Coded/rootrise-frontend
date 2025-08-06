import mongoose from "mongoose";

// lib/mongodb/connect.ts

// Use direct URI for testing
const MONGODB_URI: string = "mongodb+srv://alana:alana@cluster0.upgbp3g.mongodb.net/rootrise?retryWrites=true&w=majority";

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: Cached = {
  conn: null,
  promise: null,
};

async function connectMongoDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectMongoDB;