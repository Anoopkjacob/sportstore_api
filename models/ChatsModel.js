const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ChatTemplate=new mongoose.Schema({
    requestid:{
      type: Schema.Types.ObjectId,
      ref: "requesttable"
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

module.exports=mongoose.model('chats',ChatTemplate)