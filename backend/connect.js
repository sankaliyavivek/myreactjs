const mongoose = require('mongoose');
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
.then(()=>{console.log('Connected!')})

module.exports = mongoose.connect;