import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
// ----------------------------------------------------------------
// Configurations of Express App
// ----------------------------------------------------------------
/// allow the acess from the provided url
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

/// used to specify the communication is in json
app.use(
    express.json({
        limit: "16kb",
    })
);

/// used to take data from url
app.use(
    express.urlencoded({
        extended: true,
        limit: "16kb",
    })
);

/// used to acess static public assets
app.use(express.static("public"));

/// used to perform CRUD operations from users cookie
app.use(cookieParser());

// ----------------------------------------------------------------
//  Routes
// ----------------------------------------------------------------
import userRouter from "./routes/user.route.js";
import pythonProblemRouter from "./routes/pythonProblem.route.js";
import problemRoute from "./routes/problem.route.js";
import javaScriptProblemRoute from "./routes/javascriptProblem.route.js";
import javaProblemRoute from "./routes/javaProblem.route.js";
import cppProblemRoute from "./routes/cppProblem.route.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/problem", problemRoute);
app.use("/api/v1/problem/python", pythonProblemRouter);
app.use("/api/v1/problem/javascript", javaScriptProblemRoute);
app.use("/api/v1/problem/java", javaProblemRoute);
app.use("/api/v1/problem/cpp", cppProblemRoute);

export default app;
