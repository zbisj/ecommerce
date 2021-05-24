// [ ROUTERS > PRODUCTS ] ######################################################

// 1.1. EXTERNAL DEPENDENCIES ..................................................

const multer = require("multer");
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

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValidImage = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("Invalid image type");
    if (isValidImage) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const extension = FILE_TYPE_MAP[file.mimetype];
    const fileName = file.originalname.split(" ").join("-");

    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

const validateId = (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send("Invalid product id.");
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
router.post("/", uploadOptions.single("image"), async (req, res) => {
  const {
    name,
    price,
    images,
    rating,
    category,
    numReviews,
    isFeatured,
    description,
    countInStock,
    richDescription,
  } = req.body;

  const file = req.file;
  if (!file) return res.status(400).send("This request has no image!");

  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  const image = `${basePath}${req.file.filename}`;

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
router.put("/:id", uploadOptions.single("image"), async (req, res) => {
  const {
    name,
    price,
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

  const incomingProduct = await Product.findById(req.params.id);
  if (!incomingProduct) return res.status(400).send("Invalid product Id!");

  const incomingCategory = await Category.findById(category);
  if (!incomingCategory) return res.status(400).send("Invalid category!");

  const file = req.file;
  let image;

  if (file) {
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    image = `${basePath}${req.file.filename}`;
  } else {
    image = incomingProduct.image;
  }

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

router.put(
  "/gallery-images/:id",
  uploadOptions.array("images", 10),
  async (req, res) => {
    validateId(req, res);

    const files = req.files;
    const images = [];
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    if (files) {
      files.map((file) => images.push(`${basePath}${file.filename}`));
    }

    const results = await Product.findByIdAndUpdate(
      req.params.id,
      {
        images,
      },
      {
        new: true,
      }
    );

    if (!results) return res.status(500).send("The product cannot be updated!");
    res.send(results);
  }
);

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
