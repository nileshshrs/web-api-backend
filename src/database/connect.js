import mongoose from "mongoose";
import { URI } from "../utils/env.js"; // Ensure URI is correctly imported from env

const connect = async () => {
    try {
        const connection = await mongoose.connect(URI);
        console.log(`MongoDB connected: ${connection.connection.host}.`);
    } catch (e) {
        console.log(`Could not connect to database, ${e}.`);
        process.exit(1);
    }
}

export default connect; 