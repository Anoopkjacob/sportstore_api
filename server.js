const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const cors = require('cors');


const routesurl=require('./Router/router')
const productroutesurl=require('./Router/ProductRoutes')
const billurl=require('./Router/billRoutes')
const staffurl=require('./Router/supplierRoutes')
const chaturl=require('./Router/chat')
const carturl=require('./Router/CartRoutes')
const jerseyurl=require('./Router/Customjersey')
const payement=require('./Router/payement')
const delivery=require('./Router/deliveryRoutes')

dotenv.config();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(
  process.env.MONGO_BASE_ACESS,
  { useNewUrlParser: true, useUnifiedTopology: true ,useFindAndModify: false},
  () => console.log("db connected")
);


app.use('/app',routesurl)
app.use('/product',productroutesurl)
app.use('/bill',billurl)
app.use('/supplier',staffurl)
app.use('/chat',chaturl)
app.use('/cart',carturl)
app.use('/jersey',jerseyurl)
app.use('/payment',payement)
app.use('/delivery',delivery)



app.listen(5000, () => {
  console.log("Server is running on Port");
});

