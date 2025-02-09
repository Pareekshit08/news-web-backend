const jwt = require("jsonwebtoken");
const secret = "The Secret";


function setSession(user) {
    return jwt.sign({user},secret);
}

function getSession(id) {
    if(!id) return null;
    return jwt.verify(id,secret) || null;
}

module.exports = { setSession, getSession };
 