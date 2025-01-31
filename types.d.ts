import { Connection } from "mongoose";

// Declare a global variable 'mongoose' to cache the database connection
declare global {
    var mongoose: {
        conn: Connection | null;  // Stores the active database connection or null if not connected
        promise: Promise<Connection> | null;  // Stores the connection promise or null if no connection is in progress
    };
}

// Export an empty module to ensure TypeScript recognizes the declaration
export {};
