const express=require('express');
const profileRouter= express.Router();
const {userAuth}=require('../middlewares/auth');
const {validateEditProfileData}=require('../utils/validation')



profileRouter.get("/profile/view",userAuth,async (req,res)=>{

    const user=req.user;
    res.send(user);
});

profileRouter.patch("/profile/edit",userAuth,async (req,res)=>{

    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit Request");
            console.log("asdfa")
        }else{
            
            const loggedInUser=req.user;

            Object.keys(req.body).forEach((keys)=>{
                loggedInUser[keys]=req.body[keys];
            })
            await loggedInUser.save();

            res.send(`${loggedInUser.firstName}, "Profile Updated Successful`);


                
        }
    }catch(err){ 
    res.status(400).send("Error1:  "+err.message);
  }
    


});





module.exports= profileRouter;