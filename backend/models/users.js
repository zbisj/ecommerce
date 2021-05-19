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
const productSchema = mongoose.Schema({
  name: String,
  image: String,
  countInStock: {
    type: Number,
    required: true,
  },
});

// Model
const Users = mongoose.model("Users", productSchema);

// 1.5.2. END

// 1.5. END ....................................................................

// 1.6. STYLES .................................................................
// 1.6. END ....................................................................

module.exports = Users;

// END FILE ####################################################################
