const router = require("express").Router();
const Room = require("../models/Room");
const Message = require("../models/Message");
const User = require("../models/User");
//new room

router.post("/", async (req, res) => {
  // await Message.deleteMany({});
  // await Room.deleteMany({});
  // await User.deleteMany({});
  const newRoom = new Room({
    topic: req.body.topic,
  });
  try {
    const savedRoom = await newRoom.save();
    res.status(200).json(savedRoom);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all rooms

router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
