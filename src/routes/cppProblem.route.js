import express from "express";
import { runCpp } from "../controllers/cpp.controller.js";
import {auth} from "../middleware/auth.middleware.js"

const cppProblemRoute = express.Router();

cppProblemRoute.post("/", auth,runCpp);

export default cppProblemRoute;