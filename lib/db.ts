import mongoose from "mongoose";

// Retrieve the MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI!;

// Ensure that the connection string is provided
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

// Use a global cache to prevent multiple connections in serverless environments
let cached = global.mongoose;

// If no cached connection exists, initialize it
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Function to establish a connection to MongoDB
export async function connectToDatabase() {
    // If a connection already exists, return it
    if (cached.conn) {
        return cached.conn;
    }

    // If no connection promise exists, create one
    if (!cached.promise) {
        const opts = {
            bufferCommands: true, // Allows buffering of commands before connection
            maxPoolSize: 10, // Sets the maximum number of connections in the pool
        };

        // Create a connection promise and store it in the cache
        cached.promise = mongoose.connect(MONGODB_URI, opts).then(() => mongoose.connection);
    }

    try {
        // Wait for the connection to be established
        cached.conn = await cached.promise;
    } catch (error) {
        // If an error occurs, reset the cached connection
        cached.conn = null;
    }
}
