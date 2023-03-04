const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const { isAuthUser, authorizeRoles } = require("../middelware/auth");
const router = express.Router();

router.post("/order/new", isAuthUser, newOrder);

router.get("/order/:id", isAuthUser, getSingleOrder);

router.get("/orders/me", isAuthUser, myOrders);

router.get("/admin/orders", isAuthUser, authorizeRoles("admin"), getAllOrders);

router.put(
  "/admin/order/:id",
  isAuthUser,
  authorizeRoles("admin"),
  updateOrder
);
router.delete(
  "/admin/order/:id",
  isAuthUser,
  authorizeRoles("admin"),
  deleteOrder
);

module.exports = router;
