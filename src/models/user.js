const mongoose=require('mongoose')
var validator = require('validator');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken') ;


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
    },
    {
        timestamps:true,
    });


// This keyword don't work with this keyword.
userSchema.methods.getJWT=async function(){
    
    const user =this;

    const token=await jwt.sign({_id:user._id},"DEV@Tinder$790",{expiresIn:"7d"});

    return token;
}


userSchema.methods.validatePassword= async function(password){

    const user=this;
    const passwordHash=user.password;

    const isPasswordValid=await bcrypt.compare(password,passwordHash);

    return isPasswordValid;

}

const UserModel=mongoose.model("User",userSchema);

module.exports=UserModel;