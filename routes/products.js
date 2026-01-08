const express = require("express");
const { getValues, newProducts, getSingleProduct, updateProduct, deleteProduct, createReview, getReviews, deleteReview } = require("../controller/productController");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/authenticate");
const router = express.Router();

router.route('/product').get(getValues);
router.route('/product/new').post(isAuthenticatedUser, authorizeRole('admin'), newProducts);
router.route('/product/:id').get(getSingleProduct)
    .put(updateProduct)
    .delete(deleteProduct)
router.route('/review').put(isAuthenticatedUser, createReview)
router.route('/review').get(getReviews)
router.route('/review').delete(deleteReview)

module.exports = router