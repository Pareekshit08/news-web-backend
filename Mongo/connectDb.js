const mongoose = require("mongoose");
// const url = "mongodb://127.0.0.1:27017/News";
const url = "mongodb+srv://pareekshits08:m0luC8Jj7aDxT3b5@cluster0.8nadw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/News";

const UserSchema = mongoose.Schema({
    name:String,
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

mongoose.connect(url);  
const Users = mongoose.model('Users',UserSchema);
module.exports = Users;
