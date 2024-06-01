import app from "./app.js";
import connectToDatabase from "./db/db.js";
import dotenv from "dotenv";

dotenv.config({
    path: "./.env",
});

connectToDatabase()
    .then(() => {
        app.on("error", (error) => {
            console.error("Fail to start server: " + error);
            process.exit(1);
        });

        app.listen(process.env.PORT, () => {
            console.log(`Server is Running on PORT ${process.env.PORT}`);
            console.log(`http://localhost:${process.env.PORT}`);
        });

        app.get("/", (req, res) => {
            res.status(200).send("Code Cracker Backend API");
        });
    })
    .catch(() => {
        console.error("DB Connection Failed: " + error);
        process.exit(1);
    });
