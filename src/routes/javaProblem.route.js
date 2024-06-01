import express from "express";
import { runJava } from "../controllers/java.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const javaProblemRoute = express.Router();

javaProblemRoute.post("/",auth,runJava)

export default javaProblemRoute;