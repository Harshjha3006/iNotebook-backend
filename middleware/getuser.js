const jwt = require('jsonwebtoken');
require('dotenv').config();
const fetchuser = (req,res,next)=>{
    try {
        const token = req.header('Authorization');
        const payload = jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.user = payload.user;
        console.log(req.user);
    } catch (error) {
        res.status(401).send("Please authenticate using valid token");
    }
    next();
}
module.exports = fetchuser;