const express = require("express");
const router = express.Router();

const {
  SignUp,
  Login,
  checkAuth,
  RefreshTokenHandler,
} = require("../Controllers/JwtController");

router.route("/signup").post(SignUp);
router.route("/login").post(Login);
router.route("/refresh").post(RefreshTokenHandler);

router.get("/products", checkAuth, (req, res) => {
  const data = require("../data/products.json");
  console.log("sample", req.headers);
  res.status(200).json({
    status: "success",
    data,
  });
});

module.exports = router;
