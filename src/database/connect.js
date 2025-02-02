import mongoose from "mongoose";
import { LOCAL_URI, URI } from "../utils/constants/env.js"; // Ensure URI is correctly imported from env

//change to URI if you want to change to cloud
const connect = async () => {
    try {
        const connection = await mongoose.connect(LOCAL_URI);
        console.log(`MongoDB connected: ${connection.connection.host}.`);
    } catch (e) {
        console.log(`Could not connect to database, ${e}.`);
        process.exit(1);
    }
}

export default connect; 