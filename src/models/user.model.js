import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "password is required"],
        },
        problemSolved: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Problem",
            },
        ],
        profileImage: {
            type: String,
            required: false,
            default:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDwmG52pVI5JZfn04j9gdtsd8pAGbqjjLswg&usqp=CAU",
        },
    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
