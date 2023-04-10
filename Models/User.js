import mongoose from "mongoose";
const { Schema, model} = mongoose;

const userSchema = new Schema(
    {
        email: {
            type: String,
        },
        username: {
            type: String,
        },
        password: {
            type: String,
        },
        otp: {
            type: String,
          },
        isVerified:{
            type: Boolean,
            default: false
        },
        active:{
            type:Boolean,
            default: true
        },
        image:{
            type: String,
        },
        accounttype:{
            type: String
        },
        bio: {
            type: String,
        },
    },
     
    {
        timestamps: true
    }
)

export default model('User',userSchema);