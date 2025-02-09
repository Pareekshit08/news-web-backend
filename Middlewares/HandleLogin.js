const Users = require("../Mongo/connectDb");
const {setSession,getSession} = require("../Stores/store");

const HandleLogin = async (req, res, next) => {
    const body = req.body;
    console.log(body);
    const obj = await Users.findOne({email:body.email});
    if(obj === null){
        res.status(401).json({
            msg:"User not found"
        })
        return; 
    }
    if(obj.password === body.password){
        const token = setSession(obj);
        console.log(token);
        console.log(getSession(token));
        res.cookie("user_id",token);
        console.log("Cookie is set to : " + token);
       res.status(200).json({
           msg:"User Logged In"
       });
}else{
    res.status(401).json({
        msg:"Invalid Credentials"
    });
}

}

module.exports = { HandleLogin };   

