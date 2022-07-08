const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const RateTemplate=new mongoose.Schema({
    prodid:{
      type: Schema.Types.ObjectId,
      ref: "product"
       },
      rates:[{ 
            rates:{
                      type:Number,
                      required:true
                },        

    }]
});

module.exports=mongoose.model('rates',RateTemplate)