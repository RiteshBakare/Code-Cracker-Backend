import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check if email or password is empty
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    if (!password) {
        return res.status(400).json({ message: "Password is required" });
    }

    // Check if the user exists
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    // Check if the password matches
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
        return res.status(400).json({ message: "Invalid password" });
    }

    // Create a token for the user
    const token = jwt.sign(
        {
            email: user.email,
            id: user._id,
        },
        process.env.SECRET_KEY
    );

    // Set token to the cookie
    const options = {
        httpOnly: true,
        secure: true,
    };

    // Send the user and the token to the client
    res.status(200).cookie("auth_token", token, options).json({
        user: user,
        token: token,
    });
});
const registerUser = asyncHandler(async (req, res) => {
    // getting the data
    const { username, fullName, email, password } = req.body;

    // checking if the data is valid
    if (!username) {
        return res.status(400).json({ message: "Username is required" });
    } else if (!fullName) {
        return res.status(400).json({ message: "Full Name is required" });
    } else if (!email) {
        return res.status(400).json({ message: "email is required" });
    } else if (!password) {
        return res.status(400).json({ message: "password is required" });
    }

    // checking if the user already exists
    const exsistingUser = await User.findOne({ email: email });
    if (exsistingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    // hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // creating a new user
    const user = await User.create({
        email: email,
        username: username,
        fullName: fullName,
        password: hashedPassword,
    });

    // creating a token for the user
    const token = jwt.sign(
        {
            email: user.email,
            id: user._id,
        },
        process.env.SECRET_KEY
    );

    // setting the token to the cookie
    const options = {
        httpOnly: true,
        secure: true,
    };

    // sending the user and the token to the client
    return res.status(201).cookie("auth_token", token, options).json({
        user: user,
        token: token,
    });
});

const updateAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.files?.avatar[0]?.path;
    console.log(`user id: ${req.userId}`);

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is Required ");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar is Required ");
    }

    try {
        const user = await User.findByIdAndUpdate(req.userId, {
            profileImage: avatar.url,
        });
    } catch (error) {
        console.log(error.message);
    }

    return res.status(201).json({
        message: "Avatar successfully updated",
    });
});

const logOut = asyncHandler(async (req,res)=> {
    res.clearCookie("auth_token");
    return res.status(200).json({
        message: "User successfully logged out"
    });
})


const getUserDetails = asyncHandler(async (req,res)=> {

    const userId = req.userId;

    const user = await User.findById(userId)
        .select('-password')
        .populate('problemSolved', 'title');

    return res.status(200).json(user);
})

export { loginUser, registerUser, updateAvatar ,logOut,getUserDetails };
