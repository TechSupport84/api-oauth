import mongoose  from "mongoose";

export  const connectDb  =async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URLS)
        console.log("Connected !")
    } catch (error) {
       console.log("Error", error) 
    }

}