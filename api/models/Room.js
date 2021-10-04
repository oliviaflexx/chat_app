const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
    },
  },
);

module.exports = mongoose.model("Room", RoomSchema);
