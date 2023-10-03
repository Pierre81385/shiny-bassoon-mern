const router = require("express").Router();
let Service = require("../models/Service");

//read all
router.route("/services").get((req, res) => {
  Service.find()
    .then((services) => res.status(200).json(services))
    .catch((err) => res.status(400).json("Error: " + err));
});

//read one
router.route("/services/:id").get((req, res) => {
  Service.findById(req.params.id)
    .then((services) => res.status(200).json(services))
    .catch((err) => res.status(400).json("Error: " + err));
});

//create
router.route("/services/add").post((req, res) => {
  const name = req.body.name;
  const description = req.body.description;

  const newService = new Service({
    name,
    description,
  });

  newService
    .save()
    .then(() => res.status(200).json("Service added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

//update
router.route("/services/:id").put((req, res) => {
  const { id } = req.params;
  const service = Service.findByIdAndUpdate(id, req.body);
});

//delete

module.exports = router;
