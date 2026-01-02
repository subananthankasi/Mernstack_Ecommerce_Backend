const express = require("express");
const app = express();
const product = require('./routes/products');
const auth = require('./routes/auth');
const order = require('./routes/order');
const cors = require("cors");
const errorHandler = require('./middleware/error')
const cookieParser = require('cookie-parser')


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.use('/api', product);
app.use('/api', auth);
app.use('/api', order);
app.use(errorHandler)

module.exports = app;
