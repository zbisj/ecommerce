// [ ROUTERS > CATEGORIES ] ####################################################

// 1.1. EXTERNAL DEPENDENCIES ..................................................

const express = require("express");

// 1.1. END ....................................................................

// 1.2. INTERNAL DEPENDENCIES ..................................................

const Category = require("../models/category");

// 1.2. END ....................................................................

// 1.3. IMAGES .................................................................
// 1.3. END ....................................................................

// 1.4. DATA ...................................................................
// 1.4. END ....................................................................

// 1.5. MAIN ...................................................................

// 1.5.2. FUNCTIONS & LOCAL VARIABLES
const router = express.Router();

// GET ROUTES
router.get("/", async (req, res) => {
  const categoryList = await Category.find();

  if (!categoryList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(categoryList);
});

router.get("/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res
      .status(500)
      .json({ success: false, message: "The category could not be found" });
  }
  res.status(200).send(category);
});

// POST ROUTES
router.post("/", async (req, res) => {
  const category = new Category({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  }) //prettier-ignore

  const results = await category.save();

  if (!results) return res.status(404).send("The category cannot be created!");
  res.send(results);
});

// PUT ROUTES
router.put("/:id", async (req, res) => {
  const { name, icon, color } = req.body;
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name,
      icon,
      color
    },
    {
      new: true,
    },
  ) //prettier-ignore

  const results = await category.save();

  if (!results) return res.status(404).send("The category cannot be found!");
  res.send(results);
});

// DELETE ROUTES
router.delete("/:id", async (req, res) => {
  const category = await Category.findByIdAndRemove(req.params.id)
    .then((deletedCategory) => {
      if (deletedCategory) {
        return res
          .status(200)
          .send({ success: true, message: "The category has been deleted!" });
      }
      return res
        .status(404)
        .send({ success: false, message: "The category cannot be found!" });
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
