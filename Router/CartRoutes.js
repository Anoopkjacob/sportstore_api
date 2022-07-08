const express = require("express");
const router = express.Router();

const cartTemplateCopy = require("../models/CartModel");
const productTemplatecopy = require("../models/ProductModel");

router.post("/add", async (req, resp) => {
  try {
    // console.log(req.body)

    cartTemplateCopy
      .findOne({
        customerid: req.body.loginid,
        productid: req.body.productid,
        status: "cart",
      })
      .exec((err, carttabledata) => {
        if (err) {
          resp.json({ message: "cart error " });
        } else {
          if (carttabledata) {
            resp.json({ message: "Alread added to cart" });
          }
          if (!carttabledata) {
            const cartinstance = new cartTemplateCopy({
              productid: req.body.productid,
              customerid: req.body.loginid,
              quantity: req.body.quantity,
              totalprice: req.body.totalprice,
            });
            console.log(cartinstance);
            cartinstance
              .save()
              .then((data) => {
                resp.status(200).json({ message: "successfull" });
              })
              .catch((error) => {
                resp.status(400).json({ error: error, message: " error " });
              });
          }
        }
      });
  } catch (error) {
    return resp.status(400).json({ error: error, message: "Error updating" });
  }
});

router.post("/get", async (req, resp) => {
  try {
    console.log(req.body);
    cartTemplateCopy
      .find({ customerid: req.body.customerid, status: req.body.status })
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

router.post("/total", async (req, resp) => {
  try {
    cartTemplateCopy
      .find({ customerid: req.body.customerid, status: "cart" })
      .exec((err, requestaddata) => {
        if (err) {
          resp.json({ message: "server error" });
        }
        if (!requestaddata) {
          resp.json({ message: "cart is empty" });
        }
        if (requestaddata.length !== 0) {
          let val = 0;
          let sum = requestaddata.map((item) => {
            return (val = item.totalprice);
          });
          let result = sum.reduce((a, b) => a + b);
          resp.json(result);
        }
      });
  } catch (error) {
    return resp
      .status(400)
      .json({ error: err, message: "Error fetching data" });
  }
});


router.post("/singlestockcheck", async (req, resp) => {
  try {
    cartTemplateCopy
      .findOne({ _id:req.body.id })
      .exec((err, requestaddata) => {
        if (err) {
          resp.json({ message: "server error" });
        }
        if (!requestaddata) {
          resp.json({ message: "cart is empty" });
        }
        if (requestaddata) {
 
               productTemplatecopy
              .findOne({ _id:requestaddata.productid})
              .exec((err, productdata) => {
                if (productdata.quantity-requestaddata.quantity  <= 0) {
                  resp.json({ message: "stockless" });
                  console.log("stockless")
                } else{
                  console.log("stock")
                  resp.json({ message: "stock" });
                }
              });
        }
   });
  } catch (error) {
    return resp
      .status(400)
      .json({ error: err, message: "Error fetching data" });
  }
});


router.post("/delete", async (req, resp) => {
  try {
    console.log(req.body.quantity);
    cartTemplateCopy.findOneAndDelete({ _id: req.body._id }, (err) => {
      if (err) {
        resp.json({ message: "server error" });
      } else {
        resp.json({ message: "deleted" });
      }
    });
  } catch (error) {
    return resp.status(400).json({ error: error, message: "Error updating" });
  }
});

router.post("/plus", async (req, resp) => {
  try {
    productTemplatecopy
      .findOne({ productid: req.body.productid })
      .exec((err, requestddata) => {
        if (err) {
          resp.json({ message: "server error" });
        } else {
          if (requestddata.quantity - req.body.quantity <= 0) {
            resp.json({ message: "less stock" });
          } else {
            const query = { _id: req.body._id };
            const update = {
              $inc: {
                totalprice: +req.body.unitprice,
                quantity: +1,
              },
            };
            const options = { returnNewDocument: true };
            return cartTemplateCopy
              .findOneAndUpdate(query, update, options)
              .then((updatedDocument2) => {
                if (updatedDocument2) {
                  resp.status(200).json({ message: "cart updated" });
                } else {
                  resp.status(200).json({ message: "cart not updated" });
                }
                return updatedDocument2;
              })
              .catch((err) =>
                console.error(`Failed to find and update document: ${err}`)
              );
          }
        }
      });
  } catch (error) {
    return resp
      .status(400)
      .json({ error: error, message: "Error fetching data" });
  }
});

router.post("/minus", async (req, resp) => {
  try {
    const query = { _id: req.body._id };
    const update = {
      $inc: {
        totalprice: -req.body.unitprice,
        quantity: -1,
      },
    };
    const options = { returnNewDocument: true };
    return cartTemplateCopy
      .findOneAndUpdate(query, update, options)
      .then((updatedDocument2) => {
        if (updatedDocument2) {
          resp.status(200).json({ message: "cart updated" });
        } else {
          resp.status(200).json({ message: "cart not updated" });
        }
        return updatedDocument2;
      })
      .catch((err) =>
        console.error(`Failed to find and update document: ${err}`)
      );
  } catch (error) {
    return resp
      .status(400)
      .json({ error: err, message: "Error fetching data" });
  }
});

router.post("/update", async (req, resp) => {
  try {
    productTemplatecopy
      .findOne({ productid: req.body.productid })
      .exec((err, requestddata) => {
        if (err) {
          resp.json({ message: "server error" });
        } else {
          if (requestddata.quantity - req.body.qunatity < 0) {
            resp.json({ message: "less stock" });
          } else {
            console.log(requestddata.unitprice)
            const query = { _id: req.body.id };
            const update = {
              $set: {
                totalprice: requestddata.unitprice*req.body.qunatity,
                quantity: req.body.qunatity,
              },
            };
            const options = { returnNewDocument: true };
            return cartTemplateCopy
              .findOneAndUpdate(query, update, options)
              .then((updatedDocument2) => {
                if (updatedDocument2) {
                  resp.status(200).json({ message: "cart updated" });
                } else {
                  resp.status(200).json({ message: "cart not updated" });
                }
                return updatedDocument2;
              })
              .catch((err) =>
                console.error(`Failed to find and update document: ${err}`)
              );
          }
        }
      });
  } catch (error) {
    return resp
      .status(400)
      .json({ error: error, message: "Error fetching data" });
  }
});

router.post("/onlineorder", async (req, resp) => {
  try {
    console.log(req.body);
    cartTemplateCopy
      .find({ customerid: req.body.customerid, status: { $ne: "cart" } })
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


module.exports = router;
