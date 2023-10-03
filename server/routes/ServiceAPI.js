const router = require("express").Router();
let Service = require("../models/Service");

//read all
router.route("/").get((req, res) => {
  Service.find()
    .then((services) => res.status(200).json(services))
    .catch((err) => res.status(400).json("Error: " + err));
});

//read one
router.route("/:id").get((req, res) => {
  Service.findById(req.params.id)
    .then((services) => res.status(200).json(services))
    .catch((err) => res.status(400).json("Error: " + err));
});

//create
router.route("/add").post((req, res) => {
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
router.route("/:id").put((req, res) => {
  const { id } = req.params;
  Service.findByIdAndUpdate(id, {
    name: req.body.name,
    description: req.body.description,
  })
    .then(() => {
      res.status(200).json("Service updated!");
    })
    .catch((err) => {
      res.status(400).json("Error: " + err);
    });
});

//delete
router.route("/:id").delete((req, res) => {
  const { id } = req.params;
  Service.findByIdAndDelete(id)
    .then(() => {
      res.status(200).json("Service deleted!");
    })
    .catch((err) => {
      res.status(400).json("Error: " + err);
    });
});

module.exports = router;
