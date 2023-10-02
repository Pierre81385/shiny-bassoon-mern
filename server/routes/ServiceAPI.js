const router = require("express").Router();
let Service = require("../models/Service");

router.route("/").get((req, res) => {
  Service.find()
    .then((services) => res.json(services))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const name = req.body.name;
  const description = req.body.description;

  const newService = new Service({
    name,
    description,
  });

  newService
    .save()
    .then(() => res.json("Service added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
