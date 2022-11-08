require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const User = require("./model/user");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
app.use(express.json());
app.get("/", (req, res) => {
  res.send("<h1>Hello from auth systems - LCO</h1>");
});
app.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password } = await req.body;
  console.log(req.body);

  if (!(firstname && lastname && email && password)) {
    res.status(400).send("All fields are mandatory");
  } else {
    User.create({
      firstname,
      lastname,
      email,
      password,
    });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(401).send("User already registered");
  } 
    

  
  //return res.status(200).send("User Registered Sucessfully");

  const myEncryptedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        firstname,
        lastname,
        email: email.toLowerCase(),
        password: myEncryptedPassword
    });

    const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
            expiresIn: "2h"
        }
    );

    user.token = token;
    // update or not
    res.send(210).send(user);
    return res.status(200).send("User Registered Sucessfully");
  } catch (error) {
    console.log(error);
  }


  
});

// app.get("/login", async (req, res) => {
//   const data = await User.find();
//   if (data && data.length > 0) {
//     res.status(200).send(data);
//   } else {
//     res.status(200).json({ msg: "No data" });
//   }
// });

    
module.exports = app;
