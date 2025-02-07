# creating API (Register User)

## steps
### 1. create "api" folder inside app folder
### 2. create "auth\register" folder inside api
### 3. Then create "route.ts" file inside "api/auth/register" folder
### 4. Now write business logic (restrictions)
```
import { NextRequest, NextResponse } from "next/server"; 
import { connectToDatabase } from "@/lib/db"; // Import function to connect to the database
import User from "@/models/User"; // Import User model

// Define an async function to handle POST requests
export async function POST(request: NextRequest) {
    try {
        // Extract email and password from the request body
        const { email, password } = await request.json();

        // Validate input: Ensure both email and password are provided
        if (!email || !password) {
            return NextResponse.json(
                { error: "Please provide an email and password" },
                { status: 400 } // Return a 400 Bad Request response if missing
            );
        }

        // Connect to the database
        await connectToDatabase();

        // Check if a user with the given email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 } // Return a 400 Bad Request response if user exists
            );
        }

        // Create a new user in the database
        await User.create({ email, password });

        // Return success response
        return NextResponse.json(
            { message: "User created successfully" },
            { status: 201 } // Return a 201 Created response
        );
    } catch (error) {
        // Handle errors and return a 500 Internal Server Error response
        return NextResponse.json(
            { error: "Failed to register User" },
            { status: 500 }
        );
    }
}
```