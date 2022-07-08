const mongoose = require('mongoose');

const categoreyTemplate=new mongoose.Schema({
    categoreyid:{
        type:String,
      required:true
    },
    categoreyname: {
        type:String,
     
        required:true
    },
});

module.exports=mongoose.model('categorey',categoreyTemplate)