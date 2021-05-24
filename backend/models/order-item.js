// [ MODELS > ORDER ITEM ] #####################################################

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
const orderItemSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: {
    type: Number,
    required: true,
  },
});

// Converting MongoDB "_id" field to "id"
orderItemSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Allowing quiries to fetch virtual fields
orderItemSchema.set("toJSON", {
  virtuals: true,
});

// Model
const OrderItem = mongoose.model("OrderItem", orderItemSchema);

// 1.5.2. END

// 1.5. END ....................................................................

// 1.6. STYLES .................................................................
// 1.6. END ....................................................................

module.exports = OrderItem;

// END FILE ####################################################################
