const mongoose = require('mongoose');

const brandTemplate=new mongoose.Schema({
    brandid:{
     type:String,
      required:true
    },
    brandname: {
        type:String,
        required:true
    },
});

module.exports=mongoose.model('brand',brandTemplate)