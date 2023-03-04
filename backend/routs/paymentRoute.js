const express = require("express");
const { processPayment, sendStripeApiKey } = require("../controllers/paymentControllers");
const router = express.Router();
const { isAuthUser } = require("../middelware/auth");

router.post("/payment/process",processPayment);
router.get("/stripeapikey",sendStripeApiKey);
module.exports = router;
