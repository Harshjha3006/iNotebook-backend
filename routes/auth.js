// importing required modules
const express = require("express");
const user = require("../models/user");
const {body, validationResult } = require("express-validator");
const router = express.Router();
// Creating Create user endpoint
router.post(
  "/",
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
    // Cheking if a user password already exists
    let isUserPassword = await user.findOne({password : req.body.password});
    if(isUserPassword){
        return res.status(400).send("A User Already exists with this password");
    }
    // Creating a new user and sending it as response
    let newUser = await user.create(req.body);
    res.json(newUser);
// Sending error if some internal error occurs
    }catch(error){
        res.status(500).send("Some internal server error occured");
    }

      
  }
);
module.exports = router;
