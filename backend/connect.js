const mongoose = require('mongoose');
require("dotenv").config();

// sankaliyavivek9797:XVfSG9Y7orBBJu0A
// mongoose.connect('mongodb+srv://sankaliyavivek9797:XVfSG9Y7orBBJu0A@cluster2.nhkws.mongodb.net/AdminUser')
//     .then(() => console.log('Connected!'));

mongoose.connect(process.env.MONGO_URI)
.then(()=>{console.log('Connected!')})

module.exports = mongoose.connect;