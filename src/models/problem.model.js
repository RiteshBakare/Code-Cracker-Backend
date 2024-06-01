import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
    {
        problemStatement: {
            type: String,
            required: true,
        },
        example: {
            type: String,
            required: true,
        },
        constraints: {
            type: String,
            required: true,
        },
        // ----------------------------------------------------------------
        pythonSolution: {
            type: String,
            required: true,
        },
        pythonDriverCode: {
            type: String,
            required: true,
        },
        pythonStarterCode: {
            type: String,
            required: true,
        },
        // ----------------------------------------------------------------
        javaSolution: {
            type: String,
            required: true,
        },
        javaDriverCode: {
            type: String,
            required: true,
        },
        javaStarterCode: {
            type: String,
            required: true,
        },
        // ----------------------------------------------------------------
        cppSolution: {
            type: String,
            required: true,
        },
        cppDriverCode: {
            type: String,
            required: true,
        },
        cppStarterCode: {
            type: String,
            required: true,
        },
        // ----------------------------------------------------------------
        javaScriptSolution: {
            type: String,
            required: true,
        },
        javaScriptDriverCode: {
            type: String,
            required: true,
        },
        javaScriptStarterCode: {
            type: String,
            required: true,
        },
        // ----------------------------------------------------------------
    },
    {
        timestamps: true,
    }
);

export const Problem = mongoose.model("Problem", problemSchema);
