const catchAsyncError = require("../middleware/catchAsyncError");
const Order = require('../models/orderModel');
const Product = require('../models/productModel')
const ErrorHandler = require("../utils/errorHandler");

exports.newOrder = catchAsyncError(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body


    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user.id
    })
    res.status(200).json({
        success: true,
        message: "Successfully created",
        order
    })
})

exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    const order = await Order.findById(id).populate('user', 'name email');
    if (!order) {
        next(new ErrorHandler(`order not found with this id ${id}`, 404))
    }
    res.status(200).json({
        success: true,
        order
    })

})

//get logged in user

exports.myOrders = catchAsyncError(async (req, res, next) => {
    const order = await Order.find({ user: req.user.id })
    res.status(200).json({
        success: true,
        order
    })

})


//get All orders  admin
exports.orders = catchAsyncError(async (req, res, next) => {
    const order = await Order.find()
    let totalAmount = 0

    order.forEach(amount => (
        totalAmount += amount.totalPrice
    ))
    res.status(200).json({
        success: true,
        totalAmount,
        order
    })

})

//update orders admin
exports.updateOrders = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    const order = await Order.findById(id)
    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler('order has been already delivered', 404))
    }

    order.orderItems.forEach(async orderItem => (
        await updateStock(orderItem.product, orderItem.quantity)
    ))
    order.orderStatus = req.body.orderStatus
    order.deliveredAt = Date.now();
    await order.save()
    res.status(200).json({
        success: true,
    })

})

async function updateStock(productId, quantity) {
    const product = await Product.findById(productId)
    product.stock = product.stock - quantity
    product.save({ validateBeforeSave: false })
}

//delete orders admin
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    const order = await Order.findByIdAndDelete(id)
    if (!order) {
        return next(new ErrorHandler(`order not found with this id ${id}`, 404))
    }
    res.status(200).json({
        success: true,
    })
})

