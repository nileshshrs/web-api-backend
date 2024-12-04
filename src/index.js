import express from "express";
import "dotenv/config"
import cors from 'cors'
import cookieParser from "cookie-parser"
import { PORT } from "./utils/constants/env.js";
import authRoutes from "./routes/auth.js";
import errorHandler from "./middleware/errorHandler.js";
import connect from "./database/connect.js";
import authenticate from "./middleware/authenticate.js";
import userRoutes from "./routes/userRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import { server, app } from "./config/socket.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";



app.use(express.json());
//This middleware is essential when handling form 
//submissions or other requests that send data in the application/x-www-form-urlencoded format.
app.use(express.urlencoded({ extended: true }));
//This middleware is essential when handling form 
//submissions or other requests that send data in the application/x-www-form-urlencoded format.
app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    })
)
app.use(cookieParser())


app.use("/api/v1/auth", authRoutes)
//protected routes
app.use("/api/v1/user", authenticate, userRoutes)
app.use("/api/v1/session", authenticate, sessionRoutes)
app.use("/api/v1/conversation", conversationRoutes)
app.use("/api/v1/conversation", conversationRoutes)
app.use("api/v1/messsages", authenticate, messageRoutes)
app.use(errorHandler)

app.get("/", (req, res) => {
    console.log(req),
        res.status(200).json({
            message: "this is a test. Hello World!"
        })
})

server.listen(PORT, async () => {
    console.log(`app is running on port: ${PORT} in a dev environment.`)
    connect()
})


//username nileshshrs
//password oNbIpgXdCahAOS28