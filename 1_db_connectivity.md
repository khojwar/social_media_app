# Steps:
1. Create folder called **social_media_app**
2. create project in current file
    ```javascript
        npx create-next-app@latest .
    ```
3. create `.env` file in root directory
    ```javascript
    MONGODB_URI = ""
    ```
4. create folder called `lib`
5. create `types.d.ts` file in root directory for type checking
    ```javascript
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
    ```

6. create `db.ts` file (**path:** `lib/db.ts`)
    ```javascript
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

    ```


**NOTE:** NextJS run in edge. so we need this type of checking. In case of express we can directly connect the database.
