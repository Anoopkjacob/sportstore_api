
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestTemplate=new mongoose.Schema({
    productid:{
        type:String,
         required:true
       },
    productname: {
        type:String,
        required:true
    },
    subcategorey: {
        type:String,
        required:true
    },
    brand: {
        type:String,
        required:true
    },
    size: {
        type:String,
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
    Stockrequired: {
        type:Number,
        required:true
    },
    supplierid: {
        type: Schema.Types.ObjectId,
        ref: "registrations"
    },
    status: {
        type:String,
        default:"pending"
    },
    date: {
        type:Date,
        default:Date.now
    }

});

module.exports=mongoose.model('requesttable',requestTemplate)