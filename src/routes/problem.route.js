import express from "express";
import { addProblem, getProblemById, getAllProblems } from "../controllers/problem.controller.js";
import {auth} from "../middleware/auth.middleware.js"

const problemRoute = express.Router();

problemRoute.post("/add",auth,addProblem);
problemRoute.get("/",auth,getAllProblems);
problemRoute.get("/:id",auth,getProblemById)

export default problemRoute;