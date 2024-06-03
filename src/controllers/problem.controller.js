import { Problem } from "../models/problem.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addProblem = asyncHandler(async (req, res) => {
    const {
        problemStatement,
        example,
        constraints,
        difficultyLevel,
        pythonSolution,
        pythonDriverCode,
        pythonStarterCode,
        javaSolution,
        javaDriverCode,
        javaStarterCode,
        cppSolution,
        cppDriverCode,
        cppStarterCode,
        javaScriptSolution,
        javaScriptDriverCode,
        javaScriptStarterCode,
    } = req.body;

    if (
        [
            problemStatement,
            example,
            constraints,
            difficultyLevel,
            pythonSolution,
            pythonDriverCode,
            pythonStarterCode,
            javaSolution,
            javaDriverCode,
            javaStarterCode,
            cppSolution,
            cppDriverCode,
            cppStarterCode,
            javaScriptSolution,
            javaScriptDriverCode,
            javaScriptStarterCode,
        ].some((field) => field === "")
    ) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const problem = await Problem.create({
            problemStatement,
            example,
            constraints,
            difficultyLevel,
            pythonSolution,
            pythonDriverCode,
            pythonStarterCode,
            javaSolution,
            javaDriverCode,
            javaStarterCode,
            cppSolution,
            cppDriverCode,
            cppStarterCode,
            javaScriptSolution,
            javaScriptDriverCode,
            javaScriptStarterCode,
        });
        if (!problem) {
            return res.status(400).json({
                message: "Problem could not be created someting went wrong",
            });
        }
    } catch (error) {
        return res
            .status(400)
            .json({ message: "Something went wrong while creating a problem" });
    }

    return res.status(201).json({
        message: "Problem successfully created",
    });
});

const getAllProblems = asyncHandler(async (req, res) => {
    const problems = await Problem.find().select("_id problemStatement example constraints difficultyLevel");
    return res.status(200).json({ problems });
});

const getProblemById = asyncHandler(async (req,res)=> {
    const problemID = req.params.id;

    const problem = await Problem.findById(problemID);

    return res.status(200).json(
        problem
    );
});

const updateProblem = asyncHandler(async (req, res) => {});

export { addProblem, updateProblem, getAllProblems , getProblemById};