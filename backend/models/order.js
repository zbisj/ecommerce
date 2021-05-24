// [ MODELS > PRODUCTS ] #######################################################

// 1.1. EXTERNAL DEPENDENCIES ..................................................

const mongoose = require("mongoose");

// 1.1. END ....................................................................

// 1.2. INTERNAL DEPENDENCIES ..................................................
// 1.2. END ....................................................................

// 1.3. IMAGES .................................................................
// 1.3. END ....................................................................

// 1.4. DATA ...................................................................
// 1.4. END ....................................................................

// 1.5. MAIN ...................................................................

// 1.5.2. FUNCTIONS & LOCAL VARIABLES

// Schema
const orderSchema = mongoose.Schema({
  zip: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  city: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    require: true,
    default: "Pending",
  },
  country: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
  },
  orderItems: [
    {
      ref: "OrderItem",
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
  ],
  dateOrdered: {
    type: Date,
    default: Date.now,
  },
  shippingAddress1: {
    type: String,
    required: true,
  },
  shippingAddress2: {
    type: String,
    required: true,
  },
});

// Converting MongoDB "_id" field to "id"
orderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Allowing quiries to fetch virtual fields
orderSchema.set("toJSON", {
  virtuals: true,
});

// Model
const Order = mongoose.model("Order", orderSchema);

// 1.5.2. END

// 1.5. END ....................................................................

// 1.6. STYLES .................................................................
// 1.6. END ....................................................................

module.exports = Order;

// END FILE ####################################################################
