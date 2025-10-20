const express = require('express');
const connectDB=require('./config/database');
const app = express();
const UserModel=require('./models/user');

// This will run on every request that will come to the Server. middleware to convert json into js object.
app.use(express.json());


app.get("/user",(req,res)=>{
    res.send("User present");
})


app.post("/signup",async (req,res)=>{
    
    // We are creating new instance of the User model. and we are passing the data to that instance.
    const user=new UserModel(req.body);
      console.log(req.body);
    try{
      await user.save();
      res.send("User Created Successfully"); 
    }catch(err){
      console.log("Error Saving the user:"+ err.messge);
    }

});

app.get("/feed",async (req,res)=>{

  try{
    const users=await UserModel.find({});
    if(users.length===0){
      res.status(404).send("User not found.");
    }else{
      res.send(users);
    }

  }catch(err){
      console.log("Error Saving the user:"+ err.messge);
  }
   
})

app.delete("/deleteUser", async(req,res)=>{

  try{
    const deletedata=req.body.firstName;
    await UserModel.deleteOne({firstName:deletedata});
    res.send("User Deleted Successfully.");
  }catch(err){
      console.log("Error Saving the user:"+ err.messge);
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






