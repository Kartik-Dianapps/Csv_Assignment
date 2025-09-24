const express = require("express");
const { registerUser, loginUser, logoutUser, fetchSalesData } = require("../Controller/userController");
const verifyToken = require("../middleware/auth");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyToken, logoutUser)
router.get("/fetch", verifyToken, fetchSalesData)

module.exports = router;