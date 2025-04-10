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
     fullname:{
        type: String,
        minLenght: 6,
        maxLenght: 30
     },
     phone:{
        type: String,
        minLenght: 10,
        maxLenght: 15
     },
     address:{
        type: String,
        minLenght: 10,
        maxLenght: 100
     },
     avatar:{
        type: String,
        default: "https://res.cloudinary.com/dq0r9zv4j/image/upload/v1696350072/avatars/default-avatar_fq3g5h.png"
     },
   }, {timestamps: true}
);

const User = mongoose.model("User", userSchema);

export default User;