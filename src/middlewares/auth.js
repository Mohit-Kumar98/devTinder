const jwt=require('jsonwebtoken');
const UserModel = require('../models/user');


const userAuth= async (req,res,next)=>{

    const cookies=req.cookies;
    const {token}=cookies;

    try{
        if(!token){
            throw new Error("Please Login Again")
        }else{
            const decodedMessage=await jwt.verify(token, "DEV@Tinder$790");

            const {_id}=decodedMessage;

            const user= await UserModel.findById(_id);

            if(!user){
                throw new Error("User Not Found");
            }else{
                req.user=user;
                next();
            }
            
        }
    }catch(err){
    res.status(400).send("Error:  "+err.messge);
  }



};


module.exports={userAuth};