// [ MODELS > USERS ] ##########################################################

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
const userSchema = mongoose.Schema({
  zip: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  street: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "",
  },
  apartment: {
    type: String,
    default: "",
  },
  passwordHash: {
    type: String,
    required: true,
  },
});

// Converting MongoDB "_id" field to "id"
userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Allowing quiries to fetch virtual fields
userSchema.set("toJSON", {
  virtuals: true,
});

// Model
const Users = mongoose.model("Users", userSchema);

// 1.5.2. END

// 1.5. END ....................................................................

// 1.6. STYLES .................................................................
// 1.6. END ....................................................................

module.exports = Users;

// END FILE ####################################################################
