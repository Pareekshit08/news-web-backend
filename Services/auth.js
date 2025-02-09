const { getSession } = require("../Stores/store");

const verifyLoggedIn = async (req, res, next) => {
    console.log("Verifying logged in");
    console.log("user Logged in");
    console.log(req.cookies);
    const user_id = req.cookies?.user_id;
    console.log(user_id);
    const session = await getSession(user_id);
    console.log(session);
    if (!session) {
        res.status(401).json({
            msg:"not authorized"
        });
        return;
    }else{  
      next(); 
    }
}

module.exports = { verifyLoggedIn};
