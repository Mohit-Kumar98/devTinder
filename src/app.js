const express = require('express');
const app = express();
const {adminAuth,userAuth}=require('./middlewares/auth')

app.use("/admin",adminAuth);

app.post("/user/login",(req,res)=>{
    res.send("User logged in Successfully!");
})

app.get("/user/data",userAuth,(req,res)=>{
    throw new Error("Error with user");
    res.send("User data send")
})

app.get("/admin/getAllData",(req,res)=>{
    res.send("All Data sent");
})

app.get("/admin/deleteUser",(req,res)=>{
    res.send("Deleted a user");
})

app.use("/",(err,req,res,next)=>{
    if(err){
        // Log error
        res.status(500).send("Something went wrong");
    }else{
        next();
    }
})


app.listen(3000,()=>{
    console.log("Server is running on port 3000");  
});
