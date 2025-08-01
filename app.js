const express = require('express');
const db = require('./config/db');
const customerRouts = require('./routes/customerRoutes')
const productRoutes = require('./routes/productRoutes')
const orderRoutes = require('./routes/orderRoutes')
const setupRoutes = require('./routes/setupRoutes')
const addressRoutes = require('./routes/addressRoutes')

const app = express()
app.use(express.json())
app.use('/customers', customerRouts)
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)
app.use('/setup', setupRoutes)
app.use('/addresses', addressRoutes)
app.listen(5000,()=>{
    console.log('app is running 5000')
})





