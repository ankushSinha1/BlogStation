import mongoose from "mongoose";
const refTokenSchema = new mongoose.Schema({
    refToken: String,
}, {timestamps : {createdAt: true, updatedAt: true}})
export default mongoose.model("refToken", refTokenSchema);