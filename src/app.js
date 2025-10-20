const express = require('express');
const connectDB=require('./config/database');
const app = express();
const UserModel=require('./models/user');


app.get("/user",(req,res)=>{
    res.send("User present");
})


app.post("/signup",async (req,res)=>{
    console.log("Before data save");
    // We are creating new instance of the User model. and we are passing the data to that instance.
    const user=new UserModel({
        firstName:"Mk",
        lastName:"Kumar",
        emailId:"mk@gmail.com",
        password:"mohit@1234"
    });

    try{
      await user.save();
      res.send("User Created Successfully"); 
    }catch(err){
      console.log("Something went wrong");
    }
    
});

connectDB().then(()=>{
  console.log("DB connected")
  app.listen(3000,()=>{
    console.log("Server is running on port 3000");  
})  ;  
}).catch((err)=>{
  console.error("Failed to Connect")
})






