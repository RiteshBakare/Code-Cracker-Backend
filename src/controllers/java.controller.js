import { exec } from "child_process";
import { Problem } from "../models/problem.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import axios from "axios";
import fs from "fs";
import addPsIdToProfile from "../utils/addPsIdToProfile.js";

const runJava = asyncHandler( async (req,res) => {
    const { solCode, ps_id } = req.body;
    const userId = req.userId;

    const problem = await Problem.findById(ps_id);
    if (!problem) {
        return res.status(404).json({ message: "Problem not found" });
    }

    const driverCode = problem.javaDriverCode;

    const sourceCode = `${driverCode} \n\n ${solCode}`;

    fs.writeFileSync("main.java", sourceCode);

    exec("java main.java",async (error,stdout,stderr)=> {
        fs.unlinkSync("main.java");
        if (error) {
            console.error(`exec error: ${error.message}`);
            return res
                .status(400)
                .json({ message: `Execution error: ${error.message}` });
        }

        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res
                .status(400)
                .json({ message: `Compilation error: ${stderr}` });
        }

        const results = stdout.trim().split("\n");
                
        const cnt = results.filter((result) => result.includes("true")).length;

        if (cnt === results.length) {
            try {
                const isProblemAddedToProfile = await addPsIdToProfile(userId, ps_id);
                return res.json({
                    message: "Submitted",
                    testcases: results,
                    problemAddedToProfile: isProblemAddedToProfile,
                });
            } catch (error) {
                console.error(`Error: ${error.message}`);
                return res
                    .status(500)
                    .json({ message: "Error updating user profile" });
            }
        }

        return res.json({
            message: "Check some cases",
            testcases: results,
        });

    });
    
});

// ----------------------------------------------------------------
//  NOT USED IN PRODUCT
// ----------------------------------------------------------------
const runJavaWithJudg0 = asyncHandler(async (req, res) => {
    const { solCode } = req.body;
    const options = {
        method: "POST",
        url: "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&fields=*",
        headers: {
            "content-type": "application/json",
            "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
            "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
        },
        data: {
            source_code:
                'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello world Ritesh Bakare ");\n    }\n}',
            language_id: 62,
            stdin: "",
        },
    };

    try {
        // Submit the code
        const response = await axios.request(options);
        const token = response.data.token;

        // Wait for the result
        const resultUrl = `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false&fields=*`;
        const resultConfig = {
            method: "GET",
            url: resultUrl,
            headers: {
                "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
                "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
            },
        };

        // Polling until we get the result (not recommended for large-scale apps, use proper async mechanisms)
        let finalResponse;
        let status = "In Queue";
        while (status === "In Queue" || status === "Processing") {
            await new Promise((resolve) => setTimeout(resolve, 2000)); // wait for 2 seconds before retrying
            finalResponse = await axios.request(resultConfig);
            status = finalResponse.data.status.description;
        }

        // Send the relevant data back
        return res.status(200).json({
            stdout: finalResponse.data.stdout,
            stderr: finalResponse.data.stderr,
            compile_output: finalResponse.data.compile_output,
            message: finalResponse.data.message,
            status: finalResponse.data.status,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(`Internal Server Error ${error.message}`);
    }
});

export { runJava };
