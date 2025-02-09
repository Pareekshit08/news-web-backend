const Users = require("../Mongo/connectDb");
const HandleSignUp = async (req, res, next) => {
    const body = req.body;
    console.log(body);
    Users.create(body)
        .then((user) => {
            console.log(user);
            res.status(200).json({
                msg: "Successfully Registered!!!"
            });
        }).catch((err) => {
            console.log("error occured while creating 1");
        });
}

module.exports = { HandleSignUp };