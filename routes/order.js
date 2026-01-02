const express = require('express');
const { newOrder, getSingleOrder, myOrders, orders, updateOrders, deleteOrder } = require('../controller/orderController');
const { isAuthenticatedUser, authorizeRole } = require('../middleware/authenticate');
const router = express.Router()

router.route('/order/new').post(isAuthenticatedUser, newOrder)
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrder)
router.route('/myorders').get(isAuthenticatedUser, myOrders)
//admin routes

router.route('/orders').get(isAuthenticatedUser, authorizeRole('admin'), orders)
router.route('/order/:id').put(isAuthenticatedUser, authorizeRole('admin'), updateOrders)
router.route('/order/:id').delete(isAuthenticatedUser, authorizeRole('admin'), deleteOrder)


module.exports = router