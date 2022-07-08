const express = require("express");
const router = express.Router();


const RequestTemplateCopy = require("../models/RequestModel");
const ChatTemplatecopy = require("../models/ChatsModel");

router.post("/requestadd", async (req, resp) => {
    try {
        console.log(req.body)
        if(req.body.supplier==="")
        {
            supplierid=req.body.supplierone
        }else
        {
          supplierid=req.body.supplier
        }
        RequestTemplateCopy.findOne({ "supplierid":supplierid,"productid":req.body.productid,"status":"pending"})
          .exec((err,reqtabledata)=>{
            if(err){
              resp.json( {message : "bill error "});
            }else{
              if(reqtabledata)
              {
                resp.json( {message : "Already requested"});
              }
                if(!reqtabledata)
                  
             {
                  const reqtableinstance = new RequestTemplateCopy({
                     productid: req.body.productid,
                     productname:req.body.productname,
                     subcategorey:req.body.subcategorey,
                     brand:req.body.brand,
                     size:req.body.size,
                     color:req.body.color,
                     units:req.body.units,
                     unitprice:req.body.unitprice,
                     Stockrequired:req.body.Stockrequired,
                     supplierid:supplierid
                  });
                  console.log(reqtableinstance);
                  reqtableinstance
                    .save()
                    .then((data) => {
                      resp.status(200).json({ message:"Requested"});
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
 
 
  router.get("/requestget", async (req, resp) => {
    try{
      RequestTemplateCopy.find({}).sort({date: -1}).populate("supplierid", "name")
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

 router.post("/reqtblDelete",async (req,resp) => {
    try{
      RequestTemplateCopy.findOneAndDelete({"_id":req.body.id},(err)=>{
        if(err)
        {
          resp.json( {message : "server error"});
        }else{
          ChatTemplatecopy.findOneAndDelete({"requestid":req.body.id},(err)=>{
            if(err)
            {
              resp.json( {message : "server error"});
            }else{
              
              resp.json( {message : "deleted"});
            }
          
        });
      }
      });
    }catch (error) {
        return resp
          .status(400)
          .json({ error: error, message: "Error updating" });
      }
    });

 router.post("/requestgetwithid", async (req, resp) => {
      try{
        RequestTemplateCopy.find({supplierid:req.body.supplierid}).sort({date: -1})
      .exec((err,requestaddata)=>{
         if(err){
          resp.json( {message : "No request"});
         }else{
             resp.json(requestaddata);
         }
      });
      }
      catch(error){
          return resp
          .status(400)
          .json({ error: err, message: "Error fetching data" });
      }
    });


  router.put("/ACCEPT", async (req, resp) => {
      try {
          console.log(req.body)
          const query = { "_id":req.body.id}; 
          const update = {
            "$set": {
              "status":"Accept"
            }
          };
          // Return the updated document instead of the original document
          const options = { returnNewDocument: true };
          return RequestTemplateCopy.findOneAndUpdate(query, update, options)
            .then(updatedDocument1 => {
              if(updatedDocument1) {
                resp.status(200).json({ message: "Accepted"});
    
                console.log(`Successfully Accepted ${updatedDocument1}.`)
              } else {
                resp.status(200).json({ message: "Accepted failed"});
                console.log("Accepted failed")
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

    
router.put("/REJECT", async (req, resp) => {
  try {
    console.log(req.body)
    const query = { "_id":req.body.id};
    const update = {
      "$set": {
        "status":"Reject"
      }
    };
    // Return the updated document instead of the original document
    const options = { returnNewDocument: true };
    return RequestTemplateCopy.findOneAndUpdate(query, update, options)
      .then(updatedDocument1 => {
        if(updatedDocument1) {
          resp.status(200).json({ message: "Reject"});

          console.log(`Successfully Reject ${updatedDocument1}.`)
        } else {
          resp.status(200).json({ message: "Reject failed"});
          console.log("Reject failed")
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


// chart data in admin panel 

router.get("/totalcount", async (req, resp) => {
  try{
    RequestTemplateCopy.aggregate([
      {
      $group:{
        _id:{status:"$status"},
        count:{$sum:1}
      }
    }
    ])
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