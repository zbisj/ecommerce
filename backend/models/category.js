// [ MODELS > CATEGORY ] #######################################################

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
const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
  },
  color: {
    type: String,
  },
});

// Converting MongoDB "_id" field to "id"
categorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Allowing quiries to fetch virtual fields
categorySchema.set("toJSON", {
  virtuals: true,
});

// Model
const Category = mongoose.model("Category", categorySchema);

// 1.5.2. END

// 1.5. END ....................................................................

// 1.6. STYLES .................................................................
// 1.6. END ....................................................................

module.exports = Category;

// END FILE ####################################################################
