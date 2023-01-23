import mongoose from "mongoose";

const db = async () =>{
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('connected to db');
};

export default db;