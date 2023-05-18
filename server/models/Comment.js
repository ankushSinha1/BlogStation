import mongoose from "mongoose";
const commentSchema = new mongoose.Schema({
    text:{
        type: String,
        required: true,
    },
    author: {},
    postId: String,
    likes:  {
        type: Number,
        default: 0,    
    },
    totalReports:{
        type: Number,
        default: 0,
    }
}, {timestamps: {createdAt: true, updatedAt: true}})
export default mongoose.model("Comment", commentSchema);