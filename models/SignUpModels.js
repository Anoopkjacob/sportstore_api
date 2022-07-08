const mongoose = require('mongoose');

const signUpTemplate=new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    email: {
        type:String,
        unique: true,
        required: 'Email address is required',
        
    },
    phone: {
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    address: {
        type:String,
        required:true
    },
    city: {
        type:String,
        required:true
    },
    zip: {
        type:String,
        required:true
    },
    usetype: {
        type:String,
        required:true
    },
    companyname: {
        type:String,
        required:function(){return this.usetype==='supplier'}
    },
    branch: {
        type:String,
        required:function(){return this.usetype==='supplier'}
    },
    badge: {
        type:String,
        required:function(){return this.usetype==='supplier'}
    },
    licence: {
        type:String,
        required:function(){return this.usetype==='supplier'}
    },
    status: {
        type:String,
        default:'INACTIVE'
    },
    date: {
        type:Date,
        default:Date.now()
    },
    url: {
        type:String,
        required:true
    },
    OTP: {
        type:String,
        required:true
    }
});

module.exports=mongoose.model('registrations',signUpTemplate)