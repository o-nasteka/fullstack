const express = require('express')
// Add Mongoose is a MongoDB object modeling tool
const mongoose = require('mongoose')
// Add BodyParser
const bodyParser = require('body-parser')

// Add Routes
const analyticsRoutes = require('./routes/analytics');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/category');
const orderRoutes = require('./routes/order');
const positionRoutes = require('./routes/position');
const keys = require('./config/keys')
const app = express();

// Connect to MongoDB
mongoose.connect(keys.mongoURI)
    .then(() => console.log('MongoDB connected!'))
    .catch(error => console.log(error))

// Add and Use Morgan
app.use(require('morgan')('dev'))
// Use bodyParser
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
// Add and Use Cors
app.use(require('cors')('dev'))

app.use('/api/analytics', analyticsRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/position', positionRoutes)

module.exports = app