const adminAuth=(req,res,next)=>{
    console.log("Admin auth is getting checked")
    const token1= "xyzadsf";
    const isAdminAuthorized=token1==="xyz"

    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized request");

    }else{
        next();
    }
};

const userAuth=(req,res,next)=>{

    console.log("User auth is getting checked");
    const token2="abc";
    const isUserAuthorized=token2==="abc";

    if(!isUserAuthorized){
        res.status(401).send("unauthorized request");
    }else{
        console.log("User verified")
        next();
    }

};


module.exports={adminAuth,userAuth};