var express=require('express');
var app=express();
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({
    extended:false
}));

const user = require('./Routes/user.js');
app.use('/api',user);

app.listen(process.env.PORT,()=>{
    console.log(`server is running in port: ${process.env.PORT}`)
})