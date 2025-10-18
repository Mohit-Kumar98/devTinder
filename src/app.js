const express = require('express');

const app = express();


// This will only handle GET call to the /.
app.get("/user",(req,res)=>{
   res.send({firstname:"Mohit",lastname:"Kumar"});
})

app.post("/user",(req,res)=>{
    // Save data to DB.
    res.send("Data successfully saved to the database");
})

app.delete("/user",(req,res)=>{
    res.send("User Deleted Successfully");N  
})

// This will match all the HTTP method API calls to the /hello.
app.use("/hello",(req,res)=>{
   res.send("Hello world ");
})




app.listen(3000,()=>{
    console.log("Server is running on port 3000");  
});
