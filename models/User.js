import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    username:{type:String},
    githubId:{type:String},
    avatar:{type:String}
})

export  const User = mongoose.model("User", userSchema)