const router = require("express").Router();
const User = require("../models/Users");

router.route("/add").post((req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const streetAddress1 = req.body.password;
  const city = req.body.city;
  const state = req.body.state;
  const zipcode = req.body.zipcode;

  const newUser = new User({
    name,
    email,
    password,
    streetAddress1,
    city,
    state,
    zipcode,
  });

  newUser
    .save()
    .then(() => res.status(200).json("Product added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
