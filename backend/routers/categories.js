// [ ROUTERS > CATEGORIES ] ####################################################

// 1.1. EXTERNAL DEPENDENCIES ..................................................

const express = require("express");

// 1.1. END ....................................................................

// 1.2. INTERNAL DEPENDENCIES ..................................................

const Category = require("../models/categories");

// 1.2. END ....................................................................

// 1.3. IMAGES .................................................................
// 1.3. END ....................................................................

// 1.4. DATA ...................................................................
// 1.4. END ....................................................................

// 1.5. MAIN ...................................................................

// 1.5.2. FUNCTIONS & LOCAL VARIABLES
const router = express.Router();

router.get("/", async (req, res) => {
  const orderList = await Product.find();

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
});

router.post("/categories", (req, res) => {
  const product = new Category({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  });

  product
    .save()
    .then((createdProduct) => {
      res.status(201).json(createdProduct);
    })
    .catch((error) => {
      res.status(500).json({
        error,
        success: false,
      });
    });
});
// 1.5.2. END

// 1.5. END ....................................................................

// 1.6. STYLES .................................................................
// 1.6. END ....................................................................

module.exports = router;

// END FILE ####################################################################
