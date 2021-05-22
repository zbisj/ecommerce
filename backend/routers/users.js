// [ ROUTERS > USERS ] #########################################################

// 1.1. EXTERNAL DEPENDENCIES ..................................................

const bcrypt = require("bcryptjs");
const express = require("express");
const jwt = require("jsonwebtoken");

// 1.1. END ....................................................................

// 1.2. INTERNAL DEPENDENCIES ..................................................

const User = require("../models/user");

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
  const userList = await User.find().select("-passwordHash");

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-passwordHash");

  if (!user) {
    res.status(500).json({ success: false });
  }
  res.send(user);
});

router.get("/get/count", async (req, res) => {
  const userCount = await User.countDocuments((count) => count);

  if (!userCount) {
    res.status(500).json({ success: false });
  }
  res.send({ userCount });
});

// POST ROUTES
router.post("/", async (req, res) => {
  const {
    zip,
    name,
    city,
    email,
    phone,
    isAdmin,
    street,
    country,
    password,
    apartment,
    passwordHash,
  } = req.body;

  const user = new User({
    zip,
    name,
    city,
    email,
    phone,
    isAdmin,
    street,
    country,
    apartment,
    passwordHash: bcrypt.hashSync(password, 10),
  });

  const results = await user.save();

  if (!results) return res.status(404).send("This user cannot be created!");
  res.send(results);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).send("This user was not found!");

  if (user && bcrypt.compareSync(password, user.passwordHash)) {
    const token = jwt.sign(
      { userId: user.id, isAdmin: user.isAdmin },
      process.env.SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.status(200).send({ user, token });
  } else {
    return res.status(400).send("Password is incorrect");
  }
});

// DELETE ROUTES
router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id)
    .then((deletedUser) => {
      if (deletedUser) {
        return res
          .status(200)
          .send({ success: true, message: "The user has been deleted!" });
      }
      return res
        .status(404)
        .send({ success: false, message: "The user cannot be found!" });
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
