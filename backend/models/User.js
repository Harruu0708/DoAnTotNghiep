import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
     // Định nghĩa schema
     username:{
        type: String,
        required: true,
        minLenght: 6,
        maxLenght: 30,
        unique: true
     },
     email:{
        type: String,
        required: true,
        minLenght: 10,
        maxLenght: 50,
        unique: true
     },
     password:{
        type: String,
        required: true,
        minLenght: 6,
        maxLenght: 30
     },
     admin :{
         type: Boolean,
         default: false
     },
   }, {timestamps: true}
);

const User = mongoose.model("User", userSchema);

export default User;