const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const JerseyChatTemplate=new mongoose.Schema({
    jerseyorderid:{
      type: Schema.Types.ObjectId,
      ref: "jersey_orders"
       },
      message:[{ 

                user:{
                      type:String,
                      required:true
                },
                content:{
                      type:String,
                      required:true
                },
                date:{
                  type:Date,
                  default:Date.now()
                }

    }]
});

module.exports=mongoose.model('jerseychats',JerseyChatTemplate)