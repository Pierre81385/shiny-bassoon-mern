const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    members: {
      type: Array,
      required: true,
    },
    isPrivate: {
      type: Boolean,
      required: true,
    },
    messages: [
      {
        user: String,
        content: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
