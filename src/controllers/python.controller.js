import { asyncHandler } from "../utils/asyncHandler.js";
import { PythonShell } from "python-shell";
import fs from "fs";
import { User } from "../models/user.model.js";
import { Problem } from "../models/problem.model.js";
import addPsIdToProfile from "../utils/addPsIdToProfile.js";

const runPython = asyncHandler(async (req, res) => {
    const { solCode, ps_id } = req.body;
    const userId = req.userId;

    if (!solCode) {
        return res.status(400).json({ message: "Code is required" });
    }

    const problem = await Problem.findById(ps_id);
    if (!problem) {
        return res.status(404).json({ message: "Problem not found" });
    }

    const driverCode = `\n${problem.pythonDriverCode}`;
    const sourceCode = `${solCode}${driverCode}`;

    fs.writeFileSync("test.py", sourceCode);

    const options = {
        mode: "text",
        pythonOptions: ["-u"],
    };

    PythonShell.run("test.py", options)
        .then(async (messages) => {
            fs.unlinkSync("test.py");

            const cnt = messages.filter((message) => message === "True").length;

            if (cnt === messages.length) {
                try {

                    const isProblemAddedToProfile = await addPsIdToProfile(
                        userId,
                        ps_id
                    );
                    
                    return res.json({
                        message: "Submitted",
                        testCases: messages,
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
                testCases: messages,
            });
        })
        .catch((err) => {
            fs.unlinkSync("test.py");
            console.error(`exec error: ${err.message}`);
            return res
                .status(500)
                .json({ message: `Execution error: ${err.message}` });
        });
});

export { runPython };
