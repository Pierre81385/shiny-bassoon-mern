const router = require("express").Router();
const User = require("../models/Users");

router.route("/add").post((req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const newUser = new User({
    name,
    email,
    password,
  });

  newUser
    .save()
    .then(() => res.status(200).json("User added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

//read all
router.route("/").get((req, res) => {
  User.find()
    .then((users) => res.status(200).json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

//read one
router.route("/:id").get((req, res) => {
  User.findById(req.params.id)
    .then((user) => res.status(200).json(user))
    .catch((err) => res.status(400).json("Error: " + err));
});

//update
router.route("/:id").put((req, res) => {
  const { id } = req.params.id;
  User.findByIdAndUpdate(id, {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    avatar: req.body.avatar,
  })
    .then(() => {
      res.status(200).json("User updated!");
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
