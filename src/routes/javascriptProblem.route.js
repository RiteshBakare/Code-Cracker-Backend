import express from "express";
import { auth } from "../middleware/auth.middleware.js";
import { runJavaScript } from "../controllers/javascript.controller.js";

const javaScriptProblemRoute = express.Router();

javaScriptProblemRoute.post("/",auth,runJavaScript);

export default  javaScriptProblemRoute;