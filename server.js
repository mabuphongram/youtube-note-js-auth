require('dotenv').config()
const express = require('express')

//register route
const authRoutes = require('./routes/auth-route')
const homeRoutes = require('./routes/home-route')
const adminRoutes = require('./routes/admin-route')
const uploadImageRoutes = require('./routes/storage-route')

const app = express()
const port = process.env.PORT || 3000

const connectDB = require('./database/db')

//connect to the database
connectDB()

// Middleware to parse JSON request
app.use(express.json())


app.use('/api/auth', authRoutes)
app.use('/api/home', homeRoutes)
app.use('/api/admin',adminRoutes)
app.use('/api/image',uploadImageRoutes)

app.listen(port,() => {
    console.log(`Server is running on port ${port}`);
    
})