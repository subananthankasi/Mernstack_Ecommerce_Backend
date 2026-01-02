const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter product name"],
        trim: true,
        maxLength: [100, "product name cannot exceed 100 letters"]
    },

    price: {
        type: Number,
        default: 0.0
    },

    description: {
        type: String,
        required: [true, "please enter product description"]
    },

    images: [
        {
            image: {
                type: String,
                required: true
            }
        }
    ],

    category: {
        type: String,
        required: [true, "please enter product category"],
        enum: {
            values: [
                "Electronics",
                "Mobile phones",
                "Laptops",
                "Food",
                "Cloths/Shoes",
                "Beauty/Health",
                "Accessories",
                "Headphones",
                "Sports",
                "Outdoor",
                "Home"
            ],
            message: "Please select correct category"
        }
    },

    seller: {
        type: String,
        required: [true, "Please enter product seller"]
    },

    stock: {
        type: Number,
        required: [true, "Please enter product stock"],
        max: [20, "product stock cannot exceed 20"]
    },

    numOfReviews: {
        type: Number,
        default: 0
    },
    ratings:Number,
    reviews: [
        {
            user: mongoose.Schema.Types.ObjectId,
            rating: {
                type: String,
                required: true
            },
            comment: {
                type: String,
                required: true
            },

        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const schema = mongoose.model("Product", productSchema);
module.exports = schema
