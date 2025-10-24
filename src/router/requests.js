const express=require('express')
const requestsRouter=express.Router();
const {userAuth}=require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionReqest');
const User=require('../models/user')

requestsRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{

    try{
        const fromUserId=req.user._id;
        const toUserId=req.params.toUserId;
        const status=req.params.status;
        
        const allowedStatus=["ignored","interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message:"Invalid Status Type:"+status
            })
        }

            const toUser=await User.findById(toUserId);
            if(!toUser){
                return res.status(404 ).json({message: "Invalid Request!!"});
            }
            //If there is an existing ConnectionRequest.
            const existingConnectionRequest= await ConnectionRequest.findOne({
                $or:[
                    {fromUserId,toUserId}, // {fromUserId,toUserId} is already exist in our db.
                    {fromUserId:toUserId,toUserId:fromUserId},
                ]
                
            });

            if( existingConnectionRequest){
                return res.status(400).send({message: "Connection Request Already Exists!!"});
            }
           
            const connectionRequest=new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        const data= await connectionRequest.save();
        // res.send(data);
        res.json({
            message:req.user.firstName+" is "+status + +" "+toUser.firstName,
            data, 
        })
        

            
            
            

        

    }catch(err){
        res.status(400).send("Error :"+err.message);
    }

})




module.exports=requestsRouter;