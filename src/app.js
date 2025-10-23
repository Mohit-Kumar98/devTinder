const express = require('express');
const connectDB=require('./config/database');
const app = express();
const UserModel=require('./models/user');
const {validateSignUpData}= require("./utils/validation");
const bcrypt=require('bcrypt');
const cookieParser=require('cookie-parser');
const jwt=require('jsonwebtoken');
const {userAuth}=require('./middlewares/auth');

// This will run on every request that will come to the Server. middleware to convert json into js object.
app.use(express.json());
app.use(cookieParser());


app.get("/user",(req,res)=>{
    res.send("User present");
})

// Register a new user to our app.
app.post("/signup",async (req,res)=>{
  
  

  // Validation of data
  validateSignUpData(req);
  const {firstName,lastName,emailId,password}=req.body;
  // Encrypt the data

  const passwordHash=await bcrypt.hash(password,10);
    
  // We are creating new instance of the User model. and we are passing the data to that instance.
  const user=new UserModel({
    firstName,
      lastName,
      emailId,
      password:passwordHash,
    });
    try{
      await user.save();
      res.send("User Created Successfully"); 
    }catch(err){
      res.status(400).send("Update Failed");
    }

});

// Login User using this.
app.post("/login",async (req,res)=>{
  
  const {emailId,password}=req.body;
  try{
    const user= await UserModel.findOne({
      emailId:emailId,
    })

    if(!user){
      throw new Error("Invalid Credentials");
    }else{
      const checkPassword=user.validatePassword(password);

      if(!checkPassword){
        throw new Error("Invalid Credentials");
      }else{
        // Create a JWT tocken.
        const token= await user.getJWT();

        // Add the token to cookie and send the response back to the user.
        res.cookie('token', token,{expires:new Date(Date.now()+8*3600000) , httpOnly:true});
        res.send("User Found");
      } 
    }

  }catch(err){ 
    res.status(400).send("Error:  "+err.messge);
  }

});

app.get("/profile",userAuth,async (req,res)=>{



  try{
    const user=req.user;
    res.send(user);
  }catch(err){
    res.status(400).send("Error:  "+err.messge);
  }
})

app.post("/sendConnectionRequest",userAuth,async(req,res)=>{

  const user=req.user; 
  res.send(user.firstName +" sent the Connection Request");

})


connectDB().then(()=>{
  console.log("DB connected")
  app.listen(3000,()=>{
    console.log("Server is running on port 3000");  
})  ;  
}).catch((err)=>{
  console.error("Failed to Connect")
})






