1. install 
    ```
    npm i bcryptjs
    npm i --save-dev @types/bcryptjs
    ```
2. create folder called `model` and then file `User.ts` and `Video.ts`

3. Creating `interface`, `userSchema` and `User` model in `User.ts` file
    ```
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
    ```

4. Creating `interface`, `userSchema` and `User` model in `Video.ts` file

    ```
    import mongoose, { model, models, Schema } from "mongoose";

    export const VIDEO_DIMENSIONS = {
        width: 1080,
        height: 1920
    } as const;

    export interface IVideo {
        _id?: mongoose.Types.ObjectId;
        title: string;
        description: string;
        videoUrl: string;
        thumnailUrl: string;
        controls?: boolean;
        transformation?: {
            height: number;
            width: number;
            quality: number;
        }
        createdAt?: Date;
        updatedAt?: Date;
    }

    const videoSchema = new Schema<IVideo>({
        title: {type: String, required: true},
        description: {type: String, required: true},
        videoUrl: {type: String, required: true},
        thumnailUrl: {type: String, required: true},
        controls: {type: Boolean, default: true},
        transformation: {
            height: {type: Number, default: VIDEO_DIMENSIONS.height},
            width: {type: Number, default: VIDEO_DIMENSIONS.width},
            quality: {type: Number, min: 1, max: 100, default: 100}
        }
    }, {timestamps: true});

    const Video = models?.Video || model<IVideo>("Video", videoSchema);

    export default Video;
    ```


