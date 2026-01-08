const express = require("express");
const app = express();
const product = require('./routes/products');
const auth = require('./routes/auth');
const order = require('./routes/order');
const cors = require("cors");
const errorHandler = require('./middleware/error')
const cookieParser = require('cookie-parser')
const path = require('path');


app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
// app.use(cors());
app.use(
    cors({
        origin: "http://localhost:3002",
        credentials: true,
    })
);
app.use((req, res, next) => {
    res.set({
        "Cache-Control": "no-store, no-cache, must-revalidate, private",
        Pragma: "no-cache",
        Expires: "0",
    });
    next();
});


app.use('/api', product);
app.use('/api', auth);
app.use('/api', order);
app.use(errorHandler)

module.exports = app;
