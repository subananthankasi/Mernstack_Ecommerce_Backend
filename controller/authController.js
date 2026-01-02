const catchAsyncError = require("../middleware/catchAsyncError");
const error = require("../middleware/error");
const User = require("../models/userModel");
const sendEmail = require("../utils/email");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require('../utils/jwt')
const crypto = require('crypto')
// Register 
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password, avatar } = req.body
    const user = await User.create({ name, email, password, avatar });
    sendToken(user, 201, res)
})
// Login 
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400))
    }
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
        return next(new ErrorHandler('invalid email or password', 401))
    }
    if (!await user.isValidPassword(password)) {
        return next(new ErrorHandler('invalid email or password', 401))
    }
    sendToken(user, 201, res)
})

exports.logoutUser = (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    })
        .status(200)
        .json({
            success: 'true',
            message: "logout successfully"
        })
}
// forgot password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        next(new ErrorHandler('user not found with this email', 404))
    }
    const resetToken = await user.getResetToken();
    await user.save({ validateBeforeSave: false })
    const resetUrl = `${req.protocol}://${req.get('host')}/api/password/reset/${resetToken}`

    const message = `Your password reset link is follows \n\n
    ${resetUrl} \n\n
    if you have not requested this email ,ignore it.
    `
    try {
        sendEmail({
            email: user.email,
            subject: "Ecommerce password recovery",
            message
        })
        res.status(200).json({
            success: "true",
            message: `email send to ${user.email}`
        })
    } catch (err) {
        user.resetPasswordToken = undefined
        user.resetPasswordTokenExpire = undefined
        await user.save({ validateBeforeSave: false })
        return next(new ErrorHandler(error.message, 500))
    }
})
// Reset password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({
        resetPasswordToken, resetPasswordTokenExpire: {
            $gt: Date.now()
        }
    })
    if (!user) {
        return next(new ErrorHandler('Password reset token invalid or expires'))
    }
    if (req.body.password !== req.body.confirmpassword) {
        return next(new ErrorHandler('Password does not match'))
    }
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordTokenExpire = undefined

    await user.save({ validateBeforeSave: false })
    sendToken(user, 200, res)
})

exports.getUserProfile = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success: true,
        user
    })

})
// Change password
exports.changePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password')
    if (!await user.isValidPassword(req.body.oldPassword)) {
        return next(new ErrorHandler('Old password is incorrect', 401))
    }
    user.password = req.body.password
    await user.save()
    res.status(200).json({
        success: true,
    })

})
// Update profile
exports.updateProfile = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        user
    })

})

// Admin: get all users  {{base_url}}/api/admin/users
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const user = await User.find()
    res.status(200).json({
        success: true,
        user
    })
})

// Admin: get single user   {{base_url}}/api/admin/user/694e81bf7574c2d9a24e22ae
exports.getSingleUSer = catchAsyncError(async (req, res, next) => {
    const { id } = req.params
    const user = await User.findById(id)
    if (!user) {
        next(new ErrorHandler(`user not found with this id ${id}`))
    }
    res.status(200).json({
        success: true,
        user
    })
})
// Admin: update user 
exports.updateUser = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        user
    })
})
// Admin: update user
exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
        next(new ErrorHandler(`user not found with this id ${req.params.id}`))
    }
    res.status(200).json({
        success: true,
    })
})