import express, { json } from "express";
import { auth } from "../middleware/auth.middleware.js";
import { runPython } from "../controllers/python.controller.js";

const pythonProblemRouter = express.Router();

pythonProblemRouter.post("/", auth, runPython);

export default pythonProblemRouter;
