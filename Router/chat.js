const express = require("express");
const router = express.Router();

const ChatTemplatecopy = require("../models/ChatsModel");

router.post("/chatinsert", async (req, resp) => {
    try {

      ChatTemplatecopy.findOne({requestid:req.body.requestid})
      .exec((err,chatdata)=>{
        if(err){
          resp.json( {message :" error "});
        }else{
     if(chatdata)
     {
      const query = { "requestid":req.body.requestid };
      const update = {
        "$push":  {
        "message": 
        [{ 
           "user":req.body.user,
          "content":req.body.text 
        }] 
      }
    };
        const options = { returnNewDocument: true };
        return ChatTemplatecopy.findOneAndUpdate(query, update, options)
          .then(updatedDocument => {
            if(updatedDocument) {
              resp.status(200).json({ message: "message sended"});
  
              console.log(`message sended ${updatedDocument}.`)
            } else {
              resp.status(200).json({ message: "message not send"});
              console.log("No message sended")
            }
            return updatedDocument
          });
     }
       if(!chatdata)
           
         {
              const chattinstance = new ChatTemplatecopy({
                requestid: req.body.requestid,
                  message:[{ 
                    user:req.body.user,
                    content:req.body.text
                         }]
              });
              console.log(req.body);
              chattinstance
                .save()
                .then((data) => {
                  resp.status(200).json({ message:"message sended",DATA:data});
                })
                .catch((error) => {
                  resp.status(400).json({ error: error, message: " error " });
                });
           }      
        }
      });
           
    } catch (error) {
      return resp
        .status(400)
        .json({ error: error, message: "Error updating" });
    }
  });
 
 
  router.post("/chatget", async (req, resp) => {
    
    try{
      ChatTemplatecopy.find({requestid:req.body.requestid})
    .exec((err,requestddata)=>{
       if(err){
        resp.json( {message : "no request"});
       }else{
           resp.json(requestddata);
       }
    });
    }
    catch(error){
        return resp
        .status(400)
        .json({ error: err, message: "Error fetching data" });
    }
  }); 

module.exports = router;