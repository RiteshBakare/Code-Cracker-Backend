import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";

export const auth = asyncHandler(async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (token) {
            token = token.split(" ")[1];
            let user = jwt.verify(token, process.env.SECRET_KEY);
            req.userId = user.id;
            next();
        } else {
            return res.status(401).json({
                message: "Unauthorized User Login Required",
            });
        }
    } catch (error) {
        console.log("error: " + error.message);
        return res.status(401).json({
            message: "Unauthorized User Login Required",
        });
    }
});
