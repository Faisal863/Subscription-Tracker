import mongoose from "mongoose";
import {DB_URL, PORT} from "../config/env.js";

if(!DB_URL){
    console.log("Please include the DB URL in the env file.")
}

const connectToDatabase = async () => {
    try{
       await mongoose.connect(DB_URL)

        console.log("Database connected successfully.")
    }
    catch(e){
        console.error("Error connecting to the database: ",e);
    }
}

export {connectToDatabase};