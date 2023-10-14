const router = require("express").Router();
const Room = require("../models/Rooms");
const mongoose = require("mongoose");

router.route("/add").post((req, res) => {
  const name = req.body.name;
  const members = req.body.members;

  const newRoom = new Room({
    name,
    members,
  });

  newRoom
    .save()
    .then(() => res.status(200).json("Room created!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

//read all
router.route("/").get((req, res) => {
  Room.find()
    .then((rooms) => res.status(200).json(rooms))
    .catch((err) => res.status(400).json("Error: " + err));
});

//read one
router.route("/:name").get((req, res) => {
  Room.findOne({ name: req.params.name })
    .then((room) => res.status(200).json(room))
    .catch((err) => res.status(400).json("Error: " + err));
});

//update
router.route("/:id").put((req, res) => {
  const { id } = req.params.id;
  Room.findByIdAndUpdate(id, {
    name: req.body.name,
  })
    .then(() => {
      res.status(200).json("Room updated!");
    })
    .catch((err) => {
      res.status(400).json("Error: " + err);
    });
});

//join
router.route("/:id/join/:userid").put((req, res) => {
  const id = new mongoose.Types.ObjectId(req.params.id);
  const uid = req.params.userid;
  Room.findOneAndUpdate(
    { _id: id },
    {
      $addToSet: { members: uid },
    },
    {
      new: true,
    }
  )
    .then(() => {
      res.status(200).json("Member added!");
    })
    .catch((err) => {
      res.status(400).json("Error: " + err);
    });
});

//leave
router.route("/:id/leave/:userid").put((req, res) => {
  const id = new mongoose.Types.ObjectId(req.params.id);
  const uid = req.params.userid;
  Room.findOneAndUpdate(
    { _id: id },
    {
      $pull: {
        members: uid,
      },
    },
    {
      new: true,
    }
  )
    .then(() => {
      res.status(200).json("Member removed!");
    })
    .catch((err) => {
      res.status(400).json("Error: " + err);
    });
});

//message
router.route("/:name/message/:userid").put((req, res) => {
  const name = req.params.name;
  const uid = req.params.userid;
  Room.findOneAndUpdate(
    { name: name },
    {
      $addToSet: {
        messages: {
          user: uid,
          content: req.body.content,
        },
      },
    },
    {
      new: true,
    }
  )
    .then(() => {
      res.status(200).json("Message sent!");
    })
    .catch((err) => {
      res.status(400).json("Error: " + err);
    });
});

//delete
router.route("/:id").delete((req, res) => {
  const { id } = req.params;
  User.findByIdAndDelete(id)
    .then(() => {
      res.status(200).json("User deleted!");
    })
    .catch((err) => {
      res.status(400).json("Error: " + err);
    });
});

module.exports = router;
