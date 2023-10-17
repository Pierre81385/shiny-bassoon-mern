const router = require("express").Router();
const Room = require("../models/Rooms");
const mongoose = require("mongoose");

router.route("/add").post((req, res) => {
  const name = req.body.name;
  const createdBy = req.body.createdBy;
  const members = req.body.members;
  const isPrivate = req.body.isPrivate;

  const newRoom = new Room({
    name,
    createdBy,
    isPrivate,
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
router.route("/:name").put((req, res) => {
  Room.findOneAndUpdate(
    { name: req.params.name },
    {
      name: req.body.name,
      isPrivate: req.body.isPrivate,
    }
  )
    .then(() => {
      res.status(200).json("Room updated!");
    })
    .catch((err) => {
      res.status(400).json("Error: " + err);
    });
});

//join
router.route("/:name/join/:userid").put((req, res) => {
  Room.findOneAndUpdate(
    { name: req.params.name },
    {
      $addToSet: { members: req.params.userid },
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
router.route("/:name/leave/:userid").put((req, res) => {
  Room.findOneAndUpdate(
    { name: req.params.name },
    {
      $pull: {
        members: req.params.userid,
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
  Room.findOneAndUpdate(
    { name: req.params.name },
    {
      $addToSet: {
        messages: {
          user: req.params.userid,
          username: req.body.username,
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
router.route("/:name").delete((req, res) => {
  const { name } = req.params.name;
  Room.findOneAndDelete(name)
    .then(() => {
      res.status(200).json("Room deleted!");
    })
    .catch((err) => {
      res.status(400).json("Error: " + err);
    });
});

module.exports = router;
