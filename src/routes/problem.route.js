import express from "express";
import { addProblem, getProblemById, getAllProblems } from "../controllers/problem.controller.js";
import {auth} from "../middleware/auth.middleware.js"

const problemRoute = express.Router();

problemRoute.post("/add",auth,addProblem);
problemRoute.get("/",getAllProblems);
problemRoute.get("/:id",getProblemById)

export default problemRoute;