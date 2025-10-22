const express = require('express');
const connectDB=require('./config/database');
const app = express();
const UserModel=require('./models/user');
const {validateSignUpData}= require("./utils/validation")
const bcrypt=require('bcrypt');


// This will run on every request that will come to the Server. middleware to convert json into js object.
app.use(express.json());


app.get("/user",(req,res)=>{
    res.send("User present");
})

// Register a new user to our app.
app.post("/signup",async (req,res)=>{
  
  

  // Validation of data
  validateSignUpData(req);
  const {firstName,lastName,emailId,password}=req.body;
  // Encrypt the data

  const passwordHash=await     bcrypt.hash(password,10);
  console.log(passwordHash);
    
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

// Login User using this
app.post("/login",async (req,res)=>{
  
  const {emailId,password}=req.body;
  try{
    const user= await UserModel.findOne({
      emailId:emailId
    })

    if(!user){
      res.send("User not Found.");
    }else{
      const checkPassword=await bcrypt.compare(password,user.password);

      if(!checkPassword){
        res.send("Password Incorrect.");
      }else{
        res.send("User Found");
      }
    }

  }catch(err){
    res.status(400).send("Update Failed");
  }

});


app.patch("/user", async (req,res)=>{
  const userId=req.body.userId;
  const data=req.body;

  

  try{
  
  // API level Validation.
  const ALLOWED_UPDATES=[
    "userId","photoUrl","about","gender","age","skills"
  ];

  const isUpdateAllowed=Object.keys(data).every(k=> ALLOWED_UPDATES.includes(k));
  if(!isUpdateAllowed){
    throw new Error("Update Not Allowed"); 
  }

    if(data?.skills.length>10){
      throw new Error("Skills cannot be more then"); 
    }

    const user= await UserModel.findByIdAndUpdate({ _id:userId},isUpdateAllowed,{
      returnDocument:"after",
      runValidators: true
    });

    res.send("User updated successfully");
  }catch(err){
    res.status(400).send("Update Failed");
  }

})

app.get("/feed",async (req,res)=>{

  try{
    const users=await UserModel.find({});
    if(users.length===0){
      res.status(404).send("User not found.");
    }else{
      res.send(users);
    }

  }catch(err){
      res.status(400).send("Error Saving the user:"+ err.messge);
  }
   
})

app.delete("/deleteUser", async(req,res)=>{

  try{
    const deletedata=req.body.firstName;
    await UserModel.deleteOne({firstName:deletedata});
    res.send("User Deleted Successfully.");
  }catch(err){
      res.status(400).send("Error Saving the user:"+ err.messge);
  }
    
})

connectDB().then(()=>{
  console.log("DB connected")
  app.listen(3000,()=>{
    console.log("Server is running on port 3000");  
})  ;  
}).catch((err)=>{
  console.error("Failed to Connect")
})






