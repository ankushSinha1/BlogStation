import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
    title:{
        type: String,
    },
    description:{
        type: String,
    },
    author:{
        type: String,       
    },
    picture:{
        type: String,
    },
    comments:[],
    likes:{
        type: Number,
        default: 0,
    },
    totalReports:{
        type: Number,
        default: 0,
    },
}, {
    timestamps: {           //FOR TIME
        createdAt: true,
        updatedAt: true,
    }
})

export default mongoose.model("Post", postSchema);