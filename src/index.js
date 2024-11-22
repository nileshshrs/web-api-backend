import express from "express";
import "dotenv/config"
import cors from 'cors'
import cookieParser from "cookie-parser"
import { ORIGIN, PORT } from "./utils/env.js";
import authRoutes from "./routes/auth.js";
import errorHandler from "./middleware/errorHandler.js";
import connect from "./database/connect.js";


const app = express();
app.use(express.json());
//This middleware is essential when handling form 
//submissions or other requests that send data in the application/x-www-form-urlencoded format.
app.use(express.urlencoded({ extended: true }));
//This middleware is essential when handling form 
//submissions or other requests that send data in the application/x-www-form-urlencoded format.
app.use(
    cors({
        origin: ORIGIN,
        credentials: true
    })
)
app.use(cookieParser())


app.use("/api/v1/auth", authRoutes)
app.use(errorHandler)

app.get("/", (req, res) => {
    console.log(req),
        res.status(200).json({
            message: "this is a test. Hello World!"
        })
})

app.listen(PORT, async () => {
    console.log(`app is running on port: ${PORT} in a dev environment.`)
    connect()
})


//username nileshshrs
//password oNbIpgXdCahAOS28