const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");


//REGISTER
router.post("/register", async (req, res) => {
  try {
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const newUser = new User({
      username: req.body.username,
      password: hashedPassword,
    });
    console.log(newUser)
    //save user and respond
    const user = await newUser.save();
    console.log("worked")
    res.status(200).json(user);
  } catch (err) {
    console.log("didn't work")
    res.status(500).json(err)
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }); /// I CHANGED IT FROM EMAIL TO USERNAME
    if (!user) {
      res.status(404).json("user not found");
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    !validPassword && res.status(400).json("wrong password")

    res.status(200).json(user)
  } catch (err) {
    console.log(err)
  }
});

module.exports = router;
