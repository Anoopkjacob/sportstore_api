const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productTemplate=new mongoose.Schema({
    productid:{
        type:String,
         required:true
       },
    categoreyno: {
        type: Schema.Types.ObjectId,
        ref: "categorey"
    },
    brandno: {
        type: Schema.Types.ObjectId,
        ref: "brand"
    },
    subcatno: {
        type: Schema.Types.ObjectId,
        ref: "subcategorey"
    },
    Totalrating:{
        type:Number,
        default:-1
     },
     noofpeople:{
        type:Number,
        default:0
     },
    productname: {
        type:String,
        required:true
    },
    size: {
        type:String,
        required:true
    },
    quantity: {
        type:Number,
        required:true
    },
    units: {
        type:String,
        required:true
    },
    color: {
        type:String,
        required:true
    },
    unitprice: {
        type:String,
        required:true
    }, 
    expdate: {
        type: Date,
        required:true
    },
    description: {
        type:String,
        required:true
    },
    url: {
        type:String,
        required:true

    }, 
    Status:{
        type:String,
        default:"Active"
     }
});

module.exports=mongoose.model('product',productTemplate)

