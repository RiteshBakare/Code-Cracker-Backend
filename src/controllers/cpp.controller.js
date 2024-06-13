import { exec } from "child_process";
import { Problem } from "../models/problem.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import axios from "axios";
import fs from "fs";
import addPsIdToProfile from "../utils/addPsIdToProfile.js";

const runCpp = asyncHandler(async (req, res) => {
    const { solCode, ps_id } = req.body;
    const userId = req.userId;

    const problem = await Problem.findById(ps_id);
    if (!problem) {
        return res.status(404).json({ message: "Problem not found" });
    }

    const driverCode = problem.cppDriverCode;
    const sourceCode = `#include<bits/stdc++.h>\nusing namespace std;\n\n${solCode}\n\n${driverCode}\n\n`;

    fs.writeFileSync("test.cpp", sourceCode);

    // Chnage this code to ./output.exe in Production mode
    exec(
        "g++ test.cpp -o output && ./output",
        async (error, stdout, stderr) => {
            fs.unlinkSync("test.cpp");
            fs.unlinkSync("output.exe");

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

            const cnt = results.filter((result) => result.includes("1")).length;

            if (cnt === results.length) {
                try {
                    const isProblemAddedToProfile = await addPsIdToProfile(
                        userId,
                        ps_id
                    );
                    return res.json({
                        message: "Submitted",
                        testcases: results,
                        problemAddedToProfile: isProblemAddedToProfile,
                    });
                } catch (error) {
                    console.error(`Error_10: ${error.message}`);
                    return res
                        .status(500)
                        .json({ message: "Error updating user profile" });
                }
            }

            return res.json({
                message: "Check some cases",
                testcases: results,
            });
        }
    );
});

// ----------------------------------------------------------------
//  NOT USED IN PRODUCT
// ----------------------------------------------------------------
const runCppWithJudg0 = asyncHandler(async (req, res) => {
    const { solCode, ps_id } = req.body;

    const problem = await Problem.findById(ps_id);
    let responceObject;

    const driverCode = `${problem.cppDriverCode}`;

    const sourceCode = `#include<bits/stdc++.h>\nusing namespace std;\n\n ${solCode} \n\n ${driverCode} \n\n`;

    fs.writeFileSync("test.cpp", sourceCode);

    const options = {
        method: "POST",
        url: "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&fields=*",
        headers: {
            "content-type": "application/json",
            "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
            "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
        },
        data: {
            source_code: sourceCode,
            language_id: 54,
            stdin: "",
        },
    };

    try {
        const response = await axios.request(options);

        const token = response.data.token;

        const resultUrl = `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false&fields=*`;
        const resultConfig = {
            method: "GET",
            url: resultUrl,
            headers: {
                "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
                "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
            },
        };

        let finalResponse;
        let status = "In Queue";
        while (status === "In Queue" || status === "Processing") {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            finalResponse = await axios.request(resultConfig);
            status = finalResponse.data.status.description;
        }

        const result = finalResponse.data.stdout.split("\n");
        responceObject = finalResponse;

        if (finalResponse.data.stdout === "1\n1\n1\n1\n1\n") {
            const userId = req.userId;

            let user;

            try {
                user = await User.findByIdAndUpdate(
                    userId,
                    { $push: { problemSolved: ps_id } },
                    { new: true }
                );

                if (!user) {
                    return res.status(404).json({
                        message: "User not found something went wrong",
                    });
                }

                return res.json({
                    message: "Submitted",
                    stdout: finalResponse.data.stdout,
                    stderr: finalResponse.data.stderr,
                    compile_output: finalResponse.data.compile_output,
                    testCase1: result[0],
                    testCase2: result[1],
                    testCase3: result[2],
                    testCase4: result[3],
                    testCase5: result[4],
                });
            } catch (error) {
                console.error(`Error: ${error.message}`);
            }
        }

        return res.json({
            message: "check test case",
            stdout: finalResponse.data.stdout,
            stderr: finalResponse.data.stderr,
            compile_output: finalResponse.data.compile_output,
            testCase1: result[0],
            testCase2: result[1],
            testCase3: result[2],
            testCase4: result[3],
            testCase5: result[4],
        });
    } catch (error) {
        if (error.response) {
            console.log("Data:", error.response.data);
        }
        console.error(`error: ${error}`);
        res.status(502).json({
            error: "Compiletion error",
            message: `Internal Server Error: ${error.message}`,
        });
    }
});

export { runCpp };
