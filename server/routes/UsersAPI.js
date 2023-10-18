const router = require("express").Router();
const User = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../utils/jwtVerify");

//create new user
router.route("/registration").post(async (req, res) => {
  const user = req.body;
  const usernameTaken = await User.findOne({ username: user.username });
  const emailTaken = await User.findOne({ email: user.email });

  if (usernameTaken || emailTaken) {
    res
      .status(409)
      .json({ message: "CONFLICT, Username or email address already in use." });
  } else {
    user.password = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      username: user.username,
      email: user.email,
      password: user.password,
    });
    newUser
      .save()
      .then(() => {
        res.status(200).json({ message: "User added!" });
      })
      .catch((err) => res.status(400).json({ error: err }));
  }
});

//login user
router.route("/login").post((req, res) => {
  const user = req.body;
  User.findOne({ username: user.username }).then((u) => {
    if (!u) {
      return res.json({ message: "User not found" });
    }
    bcrypt.compare(user.password, u.password).then((match) => {
      if (match) {
        const payload = {
          id: u._id,
          username: u.username,
        };
        jwt.sign(
          payload,
          process.env.TOKEN_SECRET,
          { expiresIn: 86400 },
          (err, token) => {
            if (err) {
              return res.json({ error: err });
            } else {
              return res.json({
                message: "Login Success!",
                _id: u._id,
                jwt: "Bearer " + token,
              });
            }
          }
        );
      } else {
        return res.json({
          message: "Username or password is incorrect.",
        });
      }
    });
  });
});

//read all
router.route("/").get(authenticateToken, (req, res) => {
  User.find()
    .then((users) => res.status(200).json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

//read one
router.route("/:id").get(authenticateToken, (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.status(200).json(user))
    .catch((err) => res.status(400).json("Error: " + err));
});

//update
router.route("/:id").put(authenticateToken, (req, res) => {
  const { id } = req.params.id;
  User.findByIdAndUpdate(id, {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  })
    .then(() => {
      res.status(200).json("User updated!");
    })
    .catch((err) => {
      res.status(400).json("Error: " + err);
    });
});

//delete
router.route("/:id").delete(authenticateToken, (req, res) => {
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
