const express =require('express');
const mongoose=require('mongoose');
const cors=require('cors');
require('dotenv').config()
const userRouter=require('./routes/users')
const adminRoter = require('./routes/admin')
const app=express();
const path = require('path')
var session=require('express-session')
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
app.use(express.json())
app.use('/uploads',express.static(path.join(__dirname,'uploads')))
app.use('/profile-image',express.static(path.join(__dirname,'profile-image')))
mongoose.connect(process.env.MONGO_URI ||
    'mongodb://localhost:27017/fullStac')
    .then(()=>{
        console.log("Data Base connected")
    }).catch((err)=>{
        console.log("Data Base connection err",err)
    })
    
     app.use(session({secret:"key",resave:false,saveUninitialized:false,cookie:{maxAge:1000 * 60 *60 * 24 * 7}}))
    app.use('/api',userRouter)
    app.use('/admin',adminRoter)
const PORT=process.env.PORT ||5000;
app.listen(PORT,()=>{
    console.log(`Serve running on ${PORT}`)
})
