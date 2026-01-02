const Product = require('../models/productModel')
const ErrorHandler = require('../utils/errorHandler')
const mongoose = require("mongoose");
const catchAsyncError = require('../middleware/catchAsyncError')
const APIFeatures = require('../utils/apiFeatures')

//Get product=> product => Get
exports.getValues = catchAsyncError(async (req, res, next) => {
    const resPerPage = 3
    const apiFeature = new APIFeatures(Product.find(), req.query).search().filter().paginate(resPerPage)
    const product = await apiFeature.query;
   
    res.status(201).json({
        success: "succesfully get message",
        length: product.length,
        product: product
    })
})

//create product=> product/new => Post
exports.newProducts = catchAsyncError(async (req, res) => {
    try {
        req.body.user = req.user.id
        const product = await Product.create(req.body)
        res.status(201).json({
            success: "true",
            product: product
        })
    } catch (err) {
        console.log(err)
        res.status(404).json({
            success: "false",
            message: err.message
        })
    }

})
//get single product => product/id => get
exports.getSingleProduct = async (req, res, next) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new ErrorHandler("Invalid product ID", 400));
        }
        const product = await Product.findById(id);
        if (!product) {
            return next(new ErrorHandler("Product not found", 404));
        }
        res.status(200).json({
            success: true,
            product: [product]
        });

    } catch (error) {
        next(error);
    }
};
//update single product => product/id => put
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        return res.status(200).json({
            success: true,
            product: product ? [product] : []
        });

    } catch (error) {
        return res.status(200).json({
            success: true,
            product: []
        });
    }
};

//delete single product => product/id => delete
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndDelete(id);
        return res.status(200).json({
            success: true,
            message: "successfully deleted"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.createReview = catchAsyncError(async (req, res) => {

    const { productId, comment, rating } = req.body
    const review = {
        user: req.user.id,
        rating,
        comment
    }

    const product = await Product.findById(productId)
    //find review
    const isReviewed = product.reviews.find(
        (review) => review.user.toString() === req.user.id.toString()
    );
    if (isReviewed) {
        //updating the review
        product.reviews.forEach(review => {
            if (review.user.toString() == req.user.id.toString()) {
                review.comment = comment,
                    review.rating = rating
            }
        })

    } else {
        //create review
        product.reviews.push(review)
        product.numOfReviews = product.reviews.length;
    }


    //finding average of the product
    product.ratings =
        product.reviews.reduce((acc, review) => acc + review.rating, 0) /
        product.reviews.length;

    product.rating = isNaN(product.rating) ? 0 : product.rating

    await product.save({ validateBeforeSave: false })
    res.status(200).json({
        success: true
    })

})


//Get reviews
exports.getReviews = catchAsyncError(async (req, res) => {
    const product = await Product.findById(req.query.id)

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })

})

//filtering review and update
exports.deleteReview = catchAsyncError(async (req, res) => {
    const product = await Product.findById(req.query.productId)
    const reviews = product.reviews.filter(review => {
        return review._id.toString() !== req.query.id
    })

    const numOfReviews = reviews.length
    let ratings =
        reviews.reduce((acc, review) => acc + review.rating, 0) /
        reviews.length;
    ratings = isNaN(ratings) ? 0 : ratings

    await Product.findByIdAndUpdate(req.query.productId, {
        numOfReviews,
        ratings,
        reviews
    }, { new: true })

    res.status(200).json({
        success: true,
        message: "Successfully deleted"
    })

})