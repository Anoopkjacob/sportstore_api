// status==="FinalAccept" payement!=="paid"
// cart==="cashpayed" 

const express = require("express");
const router = express.Router();

const jerseyTemplatecopy = require("../models/CustomJerseyModel");
const cartTemplateCopy = require("../models/CartModel");


router.get("/jerseydeliveryorder", async (req, resp) => {
    try{
      jerseyTemplatecopy.find({status:"jerseymade",payement:"paid"}).sort({date: -1}).populate("userid")
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


  router.get("/onlinedeliveryorder", async (req, resp) => {
    try {
    
      cartTemplateCopy
        .find({ status:"cashpayed" })
        .populate("productid")
        .sort({ date: -1 })
        .exec((err, requestaddata) => {
          if (err) {
            resp.json({ message: "No request" });
          } else {
            resp.json(requestaddata);
          }
        });
    } catch (error) {
      return resp
        .status(400)
        .json({ error: err, message: "Error fetching data" });
    }
  });


  router.put("/jerseytaken", async (req, resp) => {
    try {
        const query = { "_id":req.body._id}; 
        const update = {
          "$set": {
            "deliveryid":req.body.deliveryid,
            "deliverycontact":req.body.deliverycontact,
            "status":"outfordelivery"
          }
        };
        const options = { returnNewDocument: true };
        return jerseyTemplatecopy.findOneAndUpdate(query, update, options)
          .then(updatedDocument1 => {
            if(updatedDocument1) {
              resp.status(200).json({ message: "Taken"});
            } else {
              resp.status(200).json({ message: "Taken failed"});
            }
            return updatedDocument1
          })
          .catch(err => console.error(`Failed to find and update document: ${err}`))
    } catch (error) {
      return resp
        .status(400)
        .json({ error: error, message: "Error updating" });
    }
  });


  router.put("/onlinetaken", async (req, resp) => {
    try {
        console.log(req.body)
        const query = { "_id":req.body._id}; 
        const update = {
          "$set": {
            "deliveryid":req.body.deliveryid,
            "deliverycontact":req.body.deliverycontact,
            "status":"outfordelivery"
          }
        };
        const options = { returnNewDocument: true };
        return cartTemplateCopy.findOneAndUpdate(query, update, options)
          .then(updatedDocument1 => {
            if(updatedDocument1) {
              resp.status(200).json({ message: "Taken"});
            } else {
              resp.status(200).json({ message: "Taken failed"});
            }
            return updatedDocument1
          })
          .catch(err => console.error(`Failed to find and update document: ${err}`))
    } catch (error) {
      return resp
        .status(400)
        .json({ error: error, message: "Error updating" });
    }
  });


 router.get("/onlinetakenshow", async (req, resp) => {
    try {
      cartTemplateCopy
        .find({ status:"outfordelivery",deliveryid:req.query.id })
        .populate("productid")
        .populate("customerid")
        .sort({ date: -1 })
        .exec((err, requestaddata) => {
          if (err) {
            resp.json({ message: "No request" });
          } else {
            resp.json(requestaddata);
          }
        });
    } catch (error) {
      return resp
        .status(400)
        .json({ error: err, message: "Error fetching data" });
    }
  });

  router.get("/jerseytakenshow", async (req, resp) => {
    try{
      jerseyTemplatecopy.find({status:"outfordelivery",deliveryid:req.query.id}).sort({date: -1}).populate("userid")
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

  router.put("/deliveredjersey", async (req, resp) => {
    try {
        const query = { "_id":req.body._id,"deliveryid":req.body.deliveryid}; 
        const update = {
          "$set": {
            "status":req.body.status
          }
        };
        const options = { returnNewDocument: true };
        return jerseyTemplatecopy.findOneAndUpdate(query, update, options)
          .then(updatedDocument1 => {
            if(updatedDocument1) {
              resp.status(200).json({ message: "updated"});
            } else {
              resp.status(200).json({ message: "updated failed"});
            }
            return updatedDocument1
          })
          .catch(err => console.error(`Failed to find and update document: ${err}`))
    } catch (error) {
      return resp
        .status(400)
        .json({ error: error, message: "Error updating" });
    }
  });


  router.put("/deliveredcart", async (req, resp) => {
    try {
      console.log(req.body.status)
        console.log(req.body)
        const query = { "_id":req.body._id, "deliveryid":req.body.deliveryid}; 
        const update = {
          "$set": {
            "status":req.body.status
          }
        };
        const options = { returnNewDocument: true };
        return cartTemplateCopy.findOneAndUpdate(query, update, options)
          .then(updatedDocument1 => {
            if(updatedDocument1) {
              resp.status(200).json({ message: "updated"});
            } else {
              resp.status(200).json({ message: "updated failed"});
            }
            return updatedDocument1
          })
          .catch(err => console.error(`Failed to find and update document: ${err}`))
    } catch (error) {
      return resp
        .status(400)
        .json({ error: error, message: "Error updating" });
    }
  });

  router.get("/onlinedeliveryhist", async (req, resp) => {
    try {
      cartTemplateCopy
        .find({ status:{$in :["delivered","notdelivered"]},deliveryid:req.query.id})
        .populate("productid")
        .populate("customerid")
        .sort({ date: -1 })
        .exec((err, requestaddata) => {
          if (err) {
            resp.json({ message: "No request" });
          } else {
            resp.json(requestaddata);
          }
        });
    } catch (error) {
      return resp
        .status(400)
        .json({ error: err, message: "Error fetching data" });
    }
  });

  router.get("/jerseydeliveryhist", async (req, resp) => {
    try{
      jerseyTemplatecopy.find({status:{$in :["delivered","notdelivered"]},deliveryid:req.query.id}).sort({date: -1}).populate("userid")
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