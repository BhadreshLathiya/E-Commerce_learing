const Product = require("../models/prodectModel");
const ErrorHandeller = require("../utils/errorHandeller");
const catchAsyncErr = require("../middelware/catchasyncError");
const Apifeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");

//create product -- Admin
exports.createProduct = catchAsyncErr(async (req, res, next) => {
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }
  const imagesLink = [];
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "Products",
    });
    // console.log(result)
    imagesLink.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }
  req.body.images = imagesLink;
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

//Get all proucts
// exports.getAllProduct = catchAsyncErr(async (req, res) => {
//   const resultPerPage = 8;
//   const productsCount = await Product.countDocuments();

//   const apiFeatures = new Apifeatures(Product.find(), req.query)
//     .search()
//     .filter();
//     // console.log(apiFeatures)

//     let products = await apiFeatures.query;
//     // console.log(product)
//     // let filteredProductsCount = product.length
//     // console.log(filteredProductsCount)
//     // apiFeatures.pagination(resultPerPage)
//     // let products = await apiFeatures.query;

//     // console.log(filteredProductsCount);

//     let filteredProductsCount = products.length;
//     console.log(filteredProductsCount);

//     apiFeatures.pagination(resultPerPage);
//     products = await apiFeatures.query;
//     // console.log(apiFeatures);

//   res.status(200).json({
//     sucess: true,
//     products,
//     productsCount,
//     resultPerPage,
//     filteredProductsCount,
//   });
// });

exports.getAllProduct = catchAsyncErr(async (req, res, next) => {
  const resultPerPage = 8;
  const productsCount = await Product.countDocuments();

  const apiFeature = new Apifeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  // console.log("api feature",apiFeature);
  // let products = await apiFeature.query;
  // console.log("products",products);
  // let filteredProductsCount = products.length;
  // console.log("filteredProductsCount",filteredProductsCount);

  const products = await apiFeature.query;
  // console.log(products);

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    // filteredProductsCount,
  });
});

// Get All Product (Admin)
exports.getAdminProducts = catchAsyncErr(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

//get single prodect
exports.getProductDetail = catchAsyncErr(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandeller("Prodect not found", 404));
  }

  res.status(200).json({
    Success: true,
    product,
  });
});

// update product -- admin
exports.updateProduct = catchAsyncErr(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandeller("Prodect not found", 404));
  }
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[1].public_id);
    }
    const imagesLink = [];
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "Products",
      });
      // console.log(result)
      imagesLink.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
    req.body.images = imagesLink;
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    Success: true,
    product,
  });
});

//delete product
exports.deleteProduct = catchAsyncErr(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandeller("Prodect not found", 404));
  }
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[1].public_id);
  }

  await product.remove();
  res.status(200).json({
    Success: true,
    message: "Product deleted successfully",
  });
});

// create new review and update review
exports.createProductReview = catchAsyncErr(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    // console.log(rev.rating)
    // avg = rating + rev.rating;
    avg += rev.rating;
  });

  // console.log(avg)

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of a product
exports.getProductReviews = catchAsyncErr(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandeller("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

exports.deleteReview = catchAsyncErr(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandeller("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });
  console.log(reviews);

  const ratings = avg / reviews.length;

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
