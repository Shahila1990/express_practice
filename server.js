const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 5000;
const authRoutes = require('./routes/auth')
const authMiddleware = require('./middleware/authMiddleware')
const roleCheck = require('./middleware/roleCheck')

const app = express();
app.use(express.json());
app.use('/api/auth' , authRoutes)

// connecting to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

//protected route
app.get('/api/profile' , authMiddleware, (req,res)=> {
    res.json({message: `Hello User ${req.user.id}` , role: req.user.role})
})

//admin-only
app.get('/api/admin' , authMiddleware, roleCheck, (req,res) =>{
    res.json({message: 'Welcome Admin'})
})

// connecting server
app.listen(port, () => console.log(`server is listening on port ${port}`));
