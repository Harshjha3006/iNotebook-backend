// importing required modules
const express = require("express");
const user = require("../models/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const {body, validationResult } = require("express-validator");
const router = express.Router();
// Route 1 : Creating Create user endpoint
router.post(
  "/createUser",
  //Validating for constraints on input fields
 body("name", "Enter a valid name").isLength({ min: 3 }), 
 body("email", "Enter a valid email").isEmail(),
 body("password", "password should be atleast 5 chars long").isLength({
    min: 5,
  }),
  async (req, res) => {
    // Encapsulating whole response in try catch block
    try{
    const errors = validationResult(req);
    // sending error if input fields are not correct
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Checking if a user email already exists
    let isUserEmail = await user.findOne({email : req.body.email});
    if(isUserEmail){
        return res.status(400).send("A User Already exists with this email");
    }
    // Encrypting the user password
    let securePass = req.body.password;
    const salt = await bcrypt.genSalt(10);
    securePass = await bcrypt.hash(securePass,salt);
    req.body.password = securePass;
    // Creating a new user and sending it as response
    let newUser = await user.create(req.body);
    res.json(newUser);
// Sending error if some internal error occurs
    }catch(error){
        res.status(500).send("Some internal server error occured");
    }      
  }
);

// Route 2 : Creating Login Endpoint
router.post('/login',
body("email","Enter a valid email").isEmail(),
body("password","Don't enter a blank string").exists(),
async (req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    res.status(400).json({errors : errors});
  }
  let {email,password} = req.body;
  // Checking for email
  let currUser = await user.findOne({email});
  if(!currUser){
    res.status(400).send("Login using correct credentials");
  }
  // verifying password
  let passwordCompare = await bcrypt.compare(password,currUser.password);
  if(!passwordCompare){
    res.status(400).send("Login using correct credentials");
  }
  const data = {
    user : {
      email : user.email
    }
  }
  //Sending jwt token to user 
  const authToken = jwt.sign(data,process.env.JWT_SECRET_KEY);
  res.json({authToken});
})
module.exports = router;
