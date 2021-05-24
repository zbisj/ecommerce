// [ ROUTERS > ORDERS ] ########################################################

// 1.1. EXTERNAL DEPENDENCIES ..................................................

const express = require("express");

// 1.1. END ....................................................................

// 1.2. INTERNAL DEPENDENCIES ..................................................

const Order = require("../models/order");
const OrderItem = require("../models/order-item");

// 1.2. END ....................................................................

// 1.3. IMAGES .................................................................
// 1.3. END ....................................................................

// 1.4. DATA ...................................................................
// 1.4. END ....................................................................

// 1.5. MAIN ...................................................................

// 1.5.2. FUNCTIONS & LOCAL VARIABLES
const router = express.Router();

router.get("/", async (req, res) => {
  const orderList = await Order.find()
    .populate("user", "name")
    .sort({ dateOrdered: -1 });

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
});

router.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    });

  if (!order) {
    res.status(500).json({ success: false });
  }
  res.send(order);
});

router.get("/get/count", async (req, res) => {
  const orderCount = await Order.countDocuments((count) => count);

  if (!orderCount) {
    res.status(500).json({ success: false });
  }
  res.send({ orderCount });
});

router.get("/get/totalsales", async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
  ]);

  console.log("TOTAL SALE: ", totalSales);
  if (!totalSales) {
    res.status(400).json("The order sales could not be generated");
  }
  res.send({ totalsales: totalSales.pop().totalsales });
});

router.get("/get/userorders/:userId", async (req, res) => {
  const userOrdlerList = await Order.find({ user: req.params.userId })
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    })
    .sort({ dateOrdered: -1 });

  if (!userOrdlerList) {
    res.status(500).json({ success: false });
  }
  res.send(userOrdlerList);
});

// POST ROUTES
router.post("/", async (req, res) => {
  const {
    zip,
    user,
    city,
    phone,
    status,
    country,
    orderItems,
    shippingAddress1,
    shippingAddress2,
  } = req.body;

  const orderItemsIds = Promise.all(
    orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        product: orderItem.product,
        quantity: orderItem.quantity,
      });

      const results = await newOrderItem.save();
      return results._id;
    })
  );

  const resolvedOrdersItemIds = await orderItemsIds;

  const totalPrices = await Promise.all(
    resolvedOrdersItemIds.map(async (orderItemId) => {
      const item = await OrderItem.findById(orderItemId).populate(
        "product",
        "price"
      );
      const totalPrice = item.product.price * item.quantity;
      return totalPrice;
    })
  );

  const orderTotal = totalPrices.reduce((a, b) => a + b, 0);

  const order = new Order({
    zip,
    user,
    city,
    phone,
    status,
    country,
    orderItems: resolvedOrdersItemIds,
    totalPrice: orderTotal,
    shippingAddress1,
    shippingAddress2,
  });

  const results = await order.save();

  if (!results) return res.status(404).send("The category cannot be created!");
  res.send(results);
});

// PUT ROUTES
router.put("/:id", async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );

  if (!order) return res.status(400).send("The order cannot be updated!");
  res.send(order);
});

// DELETE ROUTES
router.delete("/:id", async (req, res) => {
  const order = await Order.findByIdAndRemove(req.params.id)
    .then(async (order) => {
      if (order) {
        // Deleting order items within the order
        await order.orderItems.map(async (orderItem) => {
          const results = await OrderItem.findByIdAndDelete(orderItem);
        });
        return res
          .status(200)
          .send({ success: true, message: "The order has been deleted!" });
      }
      return res
        .status(404)
        .send({ success: false, message: "The order cannot be found!" });
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
