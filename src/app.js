const express = require('express');
const connectDB=require('./config/database');
const app = express();
const cookieParser=require('cookie-parser');



// This will run on every request that will come to the Server. middleware to convert json into js object.
app.use(express.json());
app.use(cookieParser());
 

const authRouter=require('./router/auth');
const profileRouter=require('./router/profile');
const requestsRouter=require('./router/requests');


app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestsRouter);

 

connectDB().then(()=>{
  console.log("DB connected")
  app.listen(3000,()=>{
    console.log("Server is running on port 3000");  
})  ;  
}).catch((err)=>{
  console.error("Failed to Connect")
})






