
const express = require("express");
const router = express.Router();
const {HandleLogin} = require("../Middlewares/HandleLogin");
const {HandleSignUp} = require("../Middlewares/HandleSignUp");
router.post("/login", HandleLogin);
router.post("/signup", HandleSignUp);
module.exports = router; 