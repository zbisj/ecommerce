// [ MAIN SERVER ] #############################################################

// 1.1. EXTERNAL DEPENDENCIES ..................................................

require("dotenv/config");
const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const mongoose = require("mongoose");

// 1.1. END ....................................................................

// 1.2. INTERNAL DEPENDENCIES ..................................................

const usersRouter = require("./routers/users");
const ordersRouter = require("./routers/orders");
const productsRouter = require("./routers/products");
const categoriesRouter = require("./routers/categories");

// 1.2. END ....................................................................

// 1.3. IMAGES .................................................................
// 1.3. END ....................................................................

// 1.4. DATA ...................................................................
// 1.4. END ....................................................................

// 1.5. MAIN ...................................................................

// 1.5.2. FUNCTIONS & LOCAL VARIABLES

const app = express();
const { API_URL, MONGO_URI } = process.env;

// MIDDLEWARE
app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(morgan("tiny"));

// DATABASE CONNECTION
mongoose
  .connect(MONGO_URI, {
    dbName: "ecommerce-database",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connection is ready.."))
  .catch((error) => console.log(error));

// ROUTERS
app.use(`${API_URL}/users`, usersRouter);
app.use(`${API_URL}/orders`, ordersRouter);
app.use(`${API_URL}/products`, productsRouter);
app.use(`${API_URL}/categories`, categoriesRouter);

// SERVER
const server = app.listen(3000, () =>
  console.log("Server running on port 3000")
);

// setInterval(
//   () =>
//     server.getConnections((err, connections) =>
//       console.log(`${connections} connections currently open`)
//     ),
//   1000
// );

process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);

let connections = [];

server.on("connection", (connection) => {
  connections.push(connection);
  connection.on(
    "close",
    () => (connections = connections.filter((curr) => curr !== connection))
  );
});

function shutDown() {
  console.log("Received kill signal, shutting down gracefully");
  server.close(() => {
    console.log("Closed out remaining connections");
    process.exit(0);
  });

  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit(1);
  }, 10000);

  connections.forEach((curr) => curr.end());
  setTimeout(() => connections.forEach((curr) => curr.destroy()), 5000);
}

// 1.5.2. END

// 1.5. END ....................................................................

// 1.6. STYLES .................................................................
// 1.6. END ....................................................................

// END FILE ####################################################################
