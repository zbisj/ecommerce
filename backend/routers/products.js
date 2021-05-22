// [ ROUTERS > PRODUCTS ] ######################################################

// 1.1. EXTERNAL DEPENDENCIES ..................................................

const express = require("express");
const mongoose = require("mongoose");

// 1.1. END ....................................................................

// 1.2. INTERNAL DEPENDENCIES ..................................................

const Product = require("../models/product");
const Category = require("../models/category");

// 1.2. END ....................................................................

// 1.3. IMAGES .................................................................
// 1.3. END ....................................................................

// 1.4. DATA ...................................................................
// 1.4. END ....................................................................

// 1.5. MAIN ...................................................................

// 1.5.2. FUNCTIONS & LOCAL VARIABLES
const router = express.Router();

const validateId = (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send("invalid product id.");
  }
};

// GET ROUTES
router.get("/", async (req, res) => {
  let filter = {};

  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }
  const productList = await Product.find(filter).populate("category");

  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});

router.get("/:id", async (req, res) => {
  validateId(req, res);

  const product = await Product.findById(req.params.id).populate("category");

  if (!product) {
    res.status(500).json({ success: false });
  }
  res.send(product);
});

router.get("/get/count", async (req, res) => {
  validateId(req, res);

  const productCount = await Product.countDocuments((count) => count);

  if (!productCount) {
    res.status(500).json({ success: false });
  }
  res.send({ productCount });
});

router.get("/get/featured/:count", async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  console.log("Count: ", +req.params.count);
  const featuredProducts = await Product.find({ isFeatured: true }).limit(
    +count
  );

  if (!featuredProducts) {
    res.status(500).json({ success: false });
  }
  res.send(featuredProducts);
});

// POST ROUTES
router.post("/", async (req, res) => {
  const {
    name,
    price,
    image,
    images,
    rating,
    category,
    numReviews,
    isFeatured,
    description,
    countInStock,
    richDescription,
  } = req.body;

  const incomingCategory = await Category.findById(category);
  if (!incomingCategory) return res.status(400).send("Invalid category!");

  const product = new Product({
    name,
    price,
    image,
    images,
    rating,
    category,
    numReviews,
    isFeatured,
    description,
    countInStock,
    richDescription,
  }) // prettier-ignore

  const createdProduct = await product.save();
  if (!createdProduct)
    return res.status(404).send("The product cannot be created!");

  res.send(createdProduct);
});

// PUT ROUTES
router.put("/:id", async (req, res) => {
  const {
    name,
    price,
    image,
    images,
    rating,
    category,
    numReviews,
    isFeatured,
    description,
    countInStock,
    richDescription,
  } = req.body;

  validateId(req, res);

  const incomingProduct = await Category.findById(category);
  if (!incomingProduct) return res.status(400).send("Invalid category!");

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name,
      price,
      image,
      images,
      rating,
      category,
      numReviews,
      isFeatured,
      description,
      countInStock,
      richDescription,
    },
    {
      new: true,
    },
  ) //prettier-ignore

  const results = await product.save();

  if (!results) return res.status(500).send("The product cannot be updated!");
  res.send(results);
});

// DELETE ROUTES
router.delete("/:id", async (req, res) => {
  validateId(req, res);

  const product = await Product.findByIdAndRemove(req.params.id)
    .then((deletedProduct) => {
      if (deletedProduct) {
        return res
          .status(200)
          .send({ success: true, message: "The product has been deleted!" });
      }
      return res
        .status(404)
        .send({ success: false, message: "The product cannot be found!" });
    })
    .catch((err) => {
      return res.status(400).send({ success: false, error: err });
    });
});
// 1.5.2. END

// 1.5. END ....................................................................

// 1.6. STYLES .................................................................
// 1.6. END ....................................................................

module.exports = router;

// END FILE ####################################################################
