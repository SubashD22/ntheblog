import mongoose from "mongoose";

const db = async () =>{
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_URI);
};

export default db;