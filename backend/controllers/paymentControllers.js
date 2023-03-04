const catchAsyncErrors = require("../middelware/catchasyncError");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// console.log(process.env.STRIPE_SECRET_KEY);

exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  console.log((req.body.amount/100))
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    metadata: {
      company: "Ecommerce",
    },
  });

const transfer = Math.ceil(((req.body.amount * 80) / 100)/100);

  // // Create a Transfer to the connected account (later):
  // const transfer = await stripe.transfers.create({
  //   amount: (req.body.amount * 80) / 100,
  //   currency: 'inr',
  //   destination: '{{CONNECTED_STRIPE_ACCOUNT_ID}}',
  //   transfer_group: '{ORDER10}',
  // });

  console.log(transfer);


  // // Create a second Transfer to another connected account (later):
  // const secondTransfer = await stripe.transfers.create({
  //   amount: (req.body.amount * 20) / 100,
  //   currency: 'inr',
  //   destination: '{{OTHER_CONNECTED_STRIPE_ACCOUNT_ID}}',
  //   transfer_group: '{ORDER10}',
  // });
  const secondTransfer = Math.floor(((req.body.amount * 20) / 100)/100);
  console.log(secondTransfer)
  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
});

exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});
