const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subcategoreyTemplate=new mongoose.Schema({
    subcategoreyid:{
        type:String,
        required:true
    },
    subcategoreyname: {
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
});

module.exports=mongoose.model('subcategorey',subcategoreyTemplate)