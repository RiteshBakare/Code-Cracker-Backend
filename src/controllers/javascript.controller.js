import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs";
import { exec } from "child_process";
import { Problem } from "../models/problem.model.js";
import addPsIdToProfile from "../utils/addPsIdToProfile.js";

const runJavaScript = asyncHandler(async (req, res) => {
    const { solCode, ps_id } = req.body;
    const userId = req.userId;

    const problem = await Problem.findById(ps_id);
    if (!problem) {
        return res.status(404).json({ message: "Problem not found" });
    }

    const driverCode = `\n${problem.javaScriptDriverCode}`;

    fs.writeFileSync("test.js", solCode);

    fs.appendFileSync("test.js", driverCode);

    exec("node test.js", async (error, stdout, stderr) => {
        fs.unlinkSync("test.js");
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

        const cnt = results.filter((result) => result === "true").length;

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

export { runJavaScript };
