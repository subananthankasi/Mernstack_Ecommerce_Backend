const path = require("path");
const connectDatabase = require("../config/database");
const Products = require("../data/products.json");
const Product = require("../models/productModel");
const dotenv = require("dotenv");

//  Correct env path
dotenv.config({
  path: path.join(__dirname, "../config/config.env"),
});

//  Connect DB
connectDatabase();

const seedProducts = async () => {
  try {
    await Product.deleteMany();
    console.log("  All products deleted");

    await Product.insertMany(Products);
    console.log(" All products inserted");

    process.exit();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

seedProducts();
