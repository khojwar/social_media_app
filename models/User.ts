import mongoose, { model, models, Schema } from "mongoose";
import bcrypt from "bcryptjs";

// Define an interface for the user document structure
export interface IUser {
    email: string;  
    password: string;  
    _id?: mongoose.Types.ObjectId;  
    createdAt?: Date;  
    updatedAt?: Date;  
}

// Define the Mongoose schema for the User model
const userSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true }, // Email must be unique
    password: { type: String, required: true }, // Password is required
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Hash the password before saving the document
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {  // Hash only if the password field is modified
        this.password = await bcrypt.hash(this.password, 8); // Encrypt password with bcrypt
    }
    next(); // Move to the next middleware
});

// Check if the User model already exists, otherwise create it
const User = models?.User || model<IUser>("User", userSchema);

export default User; 
