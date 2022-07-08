
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartTemplate=new mongoose.Schema({
    productid:{
        type: Schema.Types.ObjectId,
        ref: "product"
       },
  customerid: {
           type: Schema.Types.ObjectId,
           ref: "registrations"
       },
     quantity: {
        type:Number,
        required:true
    },
    totalprice: {
        type:Number,
        required:true
    }, 
    status: {
        type:String,
        default:"cart"
    },
    rated: {
        type:String,
        default:"notrated"
    },
    payorderid: {
        type:String,
        default:"notpayed"
    },
    payementid: {
        type:String,
        default:"notpayed"
    },
    shippingaddress: {
        type:String,
        default:"null"
    },
    pin: {
        type:String,
        default:"null"
    },
    city: {
        type:String,
        default:"Kottayam"
    },
    deliverycontact: {
        type:String,
        default:"null"
    },
    deliveryid: {
        type:String,
        default:"null"
    },
    date: {
        type:Date,
        default:Date.now
    }
});

module.exports=mongoose.model('cart',cartTemplate)