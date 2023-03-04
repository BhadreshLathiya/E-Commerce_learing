const express = require("express");
const cookieParser = require("cookie-parser");
const errorMidelware = require("./middelware/error");
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config({ path: "backend/config/config.env" });

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileupload());
const product = require("./routs/productRoute");
const user = require("./routs/useRoute");
const order = require("./routs/orderRoute");
const payment = require("./routs/paymentRoute");

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

// Middelwara for error
app.use(errorMidelware);

module.exports = app;
