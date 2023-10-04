const router = require("express").Router();
const Product = require("../models/Products");

// {
//     name: { type: String, required: true },
//     description: { type: String, required: true },
//     image: { type: String, required: true },
//     price: { type: Number, required: true },
//     inventory: { type: Number, required: true },
//   }

//creat
router.route("/add").post((req, res) => {
  const name = req.body.name;
  const description = req.body.description;
  const image = req.body.image;
  const price = req.body.price;
  const inventory = req.body.inventory;

  const newProduct = new Product({
    name,
    description,
    image,
    price,
    inventory,
  });

  newProduct
    .save()
    .then(() => res.status(200).json("Product added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
