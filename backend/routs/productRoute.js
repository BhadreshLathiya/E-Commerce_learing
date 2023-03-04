const express = require("express");
const {
  getAllProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetail,
  createProductReview,
  getProductReviews,
  deleteReview,
  getAdminProducts,
} = require("../controllers/productController");
const { isAuthUser, authorizeRoles } = require("../middelware/auth");
const router = express.Router();

router.get("/products", getAllProduct);
router.post(
  "/admin/product/new",
  isAuthUser,
  authorizeRoles("admin"),
  createProduct
);
router.get(
  "/admin/products",
  isAuthUser,
  authorizeRoles("admin"),
  getAdminProducts
);
router.put(
  "/admin/product/:id",
  isAuthUser,
  authorizeRoles("admin"),
  updateProduct
);
router.delete(
  "/admin/product/:id",
  isAuthUser,
  authorizeRoles("admin"),
  deleteProduct
);
router.get("/product/:id", getProductDetail);
router.put("/review", isAuthUser, createProductReview);
router.get("/reviews", getProductReviews);
router.delete("/reviews", isAuthUser, deleteReview);

module.exports = router;
