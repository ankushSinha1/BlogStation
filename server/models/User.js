import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        default: '',
    },
    lastName:{
        type: String,
        default: '',
    },
    username: {
        type: String,
        default: '',
    },
    age:{
        type: Number,
        default: '',
    },
    email:{
        type: String,
        default: '',
    },
    password:{
        type: String,
        default: '',
    },
    dP:{
        type: String,
        default: '',
    },
    bio:{
        type: String,
        default: '',
    },
    posts:{
        type: Array,
        default: [],
    },
    following:{
        type: Number,
        default: 0,
    },
    followers:{
        type: Number,
        default: 0,
    }
})
export default mongoose.model("User", userSchema);