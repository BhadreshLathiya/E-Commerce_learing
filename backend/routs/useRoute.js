const express = require("express");
const {
  registerUser,
  loginUser,
  logOut,
  forgetPass,
  resetPassword,
  getUserDetail,
  updatePassword,
  updateProfile,
  getAllUsers,
  getSingleUsers,
  deleteUser,
  updateUserrole,
} = require("../controllers/userController");
const { isAuthUser, authorizeRoles } = require("../middelware/auth");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logOut);
router.post("/password/forgot", forgetPass);
router.put("/password/reset/:token", resetPassword);
router.put("/password/update", isAuthUser, updatePassword);
router.put("/me/update", isAuthUser, updateProfile);
router.get("/me", isAuthUser, getUserDetail);
router.get("/admin/users", isAuthUser, authorizeRoles("admin"), getAllUsers);
router.get(
  "/admin/user/:id",
  isAuthUser,
  authorizeRoles("admin"),
  getSingleUsers
);
router.put(
  "/admin/user/:id",
  isAuthUser,
  authorizeRoles("admin"),
  updateUserrole
);
router.delete(
  "/admin/user/:id",
  isAuthUser,
  authorizeRoles("admin"),
  deleteUser
);
module.exports = router;
