const mongoose=require('mongoose')
var validator = require('validator');


const userSchema= mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength:4,
        maxLength:50,
    },
    lastName: {
        type:String,
    },
    emailId:{
        type:String,
        required: true,
        unique: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email Address");
            }
        }
    },
    password:{
        type:String,
        required: true,
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","other"].includes(value)){
                throw new Error("Gender dara is not valid");
            }
        },
    },
    photoUrl:{
        type: String,
    },
    about:{
        type:String,
        default:"This is a default of the user!",
    },
    skills:{
            type:[String],
    },
},{
    timestamps:true,
});

const UserModel=mongoose.model("User",userSchema);

module.exports=UserModel;