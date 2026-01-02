const mongoose = require("mongoose")

const connectDatabase =  () => {
    mongoose.connect(process.env.DB_URL).then(con => console.log(`Databse is running in ${con.connection.host}`))
    .catch(err => (console.log(err)))
}

module.exports = connectDatabase