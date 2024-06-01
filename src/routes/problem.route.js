import express from "express";
import { addProblem, getProblems } from "../controllers/problem.controller.js";
import {auth} from "../middleware/auth.middleware.js"

const problemRoute = express.Router();

problemRoute.post("/add",auth,addProblem);
problemRoute.get("/",auth,getProblems);

export default problemRoute;