const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

const categoreyTemplatecopy = require("../models/CategoreyModels");
const brandTemplatecopy = require("../models/BrandModels");
const subcategoreyTemplatecopy = require("../models/SubcategoreyModel");
const productTemplatecopy = require("../models/ProductModel");
const RateTemplatecopy = require("../models/RatingModel");
const cartTemplatecopy = require("../models/CartModel");

//                                                     CATEGOREY ROUTES
//                                                     ---------------

// TO ADD CATEGOREY TO CATEGOREY TABLE

router.post("/categoreyAdd", async (req, resp) => {
  const categoreyId = uuidv4();
  try {
    categoreyTemplatecopy
      .findOne({ categoreyname: req.body.categoreyname })
      .exec((err, catdata) => {
        if (err) {
          resp.json({ message: "categore error " });
        } else {
          if (catdata) {
            resp.json({ message: "category alreday exist" });
          }
          if (!catdata) {
            // add to categorey
            const Categoreyinstance = new categoreyTemplatecopy({
              categoreyname: req.body.categoreyname,
              categoreyid: categoreyId,
            });
            console.log(req.body);
            Categoreyinstance.save()
              .then((data) => {
                resp
                  .status(200)
                  .json({ message: "categorey added", DATA: data });
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
      .json({ error: error, message: "Error fetching data" });
  }
});

// TO GET DATA FROM CATEGOREY TABLE

router.get("/categoreyGet", async (req, resp) => {
  try {
    categoreyTemplatecopy.find({}).exec((err, Categoreydata) => {
      if (err) {
        resp.json({ message: "categorey none" });
      } else {
        resp.json(Categoreydata);
      }
    });
  } catch (error) {
    return resp
      .status(400)
      .json({ error: err, message: "Error fetching data" });
  }
});

// TO UPDATE CATEGOREY IN CATEGOREY TABLE

router.put("/categoreyUpdate", async (req, resp) => {
  try {
    console.log(req.body);
    categoreyTemplatecopy
      .findOne({ categoreyname: req.body.categoreyname })
      .exec((err, catData) => {
        if (err) {
          resp.json({ message: "server error " });
        } else {
          if (catData) {
            resp.json({ message: "categorey alreday exist" });
          }
          if (!catData) {
            const query = { categoreyid: req.body.categoreyid };
            // Set some fields in that document
            const update = {
              $set: {
                categoreyname: req.body.categoreyname,
              },
            };
            // Return the updated document instead of the original document
            const options = { returnNewDocument: true };
            return categoreyTemplatecopy
              .findOneAndUpdate(query, update, options)
              .then((updatedDocument1) => {
                if (updatedDocument1) {
                  resp.status(200).json({ message: "categorey updated" });

                  console.log(
                    `Successfully updated document: ${updatedDocument1}.`
                  );
                } else {
                  resp.status(200).json({ message: "categorey not updated" });
                  console.log("categorey not valid.");
                }
                return updatedDocument1;
              })
              .catch((err) =>
                console.error(`Failed to find and update document: ${err}`)
              );
          }
        }
      });
  } catch (error) {
    return resp.status(400).json({ error: error, message: "Error updating" });
  }
});

//                                                   BRAND ROUTES
//                                                    -----------

// TO ADD BRAND TO BARND TABLE

router.post("/brandAdd", async (req, resp) => {
  const brandId = uuidv4();
  try {
    brandTemplatecopy
      .findOne({ brandname: req.body.brandname })
      .exec((err, branddata) => {
        if (err) {
          resp.json({ message: "brand error " });
        } else {
          if (branddata) {
            resp.json({ message: "brand alreday exist" });
          }
          if (!branddata) {
            // add to brand
            const Brandinstance = new brandTemplatecopy({
              brandname: req.body.brandname,
              brandid: brandId,
            });
            console.log(req.body);

            Brandinstance.save()
              .then((data) => {
                resp.status(200).json({ message: "brand added", DATA: data });
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
      .json({ error: error, message: "Error fetching data" });
  }
});

// TO GET DATA FROM BRAND TABLE

router.get("/brandGet", async (req, resp) => {
  try {
    brandTemplatecopy.find({}).exec((err, Branddata) => {
      if (err) {
        resp.json({ message: "brand none" });
      } else {
        resp.json(Branddata);
      }
    });
  } catch (error) {
    return resp
      .status(400)
      .json({ error: err, message: "Error fetching data" });
  }
});

// TO UPDATE  BRAND IN BRAND TABLE

router.put("/brandUpdate", async (req, resp) => {
  try {
    brandTemplatecopy
      .findOne({ brandname: req.body.brandname })
      .exec((err, brandData) => {
        if (err) {
          resp.json({ message: "server error " });
        } else {
          if (brandData) {
            resp.json({ message: "brand alreday exist" });
          }
          if (!brandData) {
            console.log(req.body);
            const query = { brandid: req.body.brandid };
            // Set some fields in that document
            const update = {
              $set: {
                brandname: req.body.brandname,
              },
            };
            // Return the updated document instead of the original document
            const options = { returnNewDocument: true };
            return brandTemplatecopy
              .findOneAndUpdate(query, update, options)
              .then((updatedDocument) => {
                if (updatedDocument) {
                  resp.status(200).json({ message: "brand updated" });

                  console.log(
                    `Successfully updated document: ${updatedDocument}.`
                  );
                } else {
                  resp.status(200).json({ message: "brand not updated" });
                  console.log("brand not valid.");
                }
                return updatedDocument;
              })
              .catch((err) =>
                console.error(`Failed to find and update document: ${err}`)
              );
          }
        }
      });
  } catch (error) {
    return resp.status(400).json({ error: error, message: "Error updating" });
  }
});

//                                                   SUBCATEGOREY ROUTES
//                                                    -----------

// TO ADD SUBCATEGOREY TO SUBCATEGOREY TABLE

router.post("/subcategoreyAdd", async (req, resp) => {
  if (req.body.categoreydrop === "") {
    catone = req.body.catone;
  } else {
    catone = req.body.categoreydrop;
  }
  if (req.body.branddrop === "") {
    brandone = req.body.brandone;
  } else {
    brandone = req.body.branddrop;
  }
  const subCatId = uuidv4();
  try {
    subcategoreyTemplatecopy
      .findOne({
        subcategoreyname: req.body.subcatname,
        categoreyno: catone,
        brandno: brandone,
      })
      .exec((err, subCatdata) => {
        if (err) {
          resp.json({ message: "subcategorey error " });
        } else {
          if (subCatdata) {
            resp.json({ message: "subcategorey alreday exist" });
          }
          if (!subCatdata) {
            // add to subcategorey
            const subCatinstance = new subcategoreyTemplatecopy({
              subcategoreyname: req.body.subcatname,
              categoreyno: catone,
              brandno: brandone,
              subcategoreyid: subCatId,
            });
            console.log(req.body);
            subCatinstance
              .save()
              .then((data) => {
                resp
                  .status(200)
                  .json({ message: "subcategorey added", DATA: data });
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
      .json({ error: error, message: "Error fetching data" });
  }
});

//  to get subcategorey from subcategorey table

router.get("/subcategoreyGet", async (req, resp) => {
  try {
    subcategoreyTemplatecopy
      .find({})
      .populate("categoreyno", "categoreyname")
      .populate("brandno", "brandname")
      .exec((err, subcatdata) => {
        if (err) {
          resp.json({ message: "subcategorey none" });
        } else {
          resp.json(subcatdata);
        }
      });
  } catch (error) {
    return resp
      .status(400)
      .json({ error: err, message: "Error fetching data" });
  }
});

// to get subcat for one based on subcatid

router.post("/subcategoreyGetOne", async (req, resp) => {
  console.log(req.body);
  if (req.body.categoreydrop === "") {
    catone = req.body.catone;
  }
  if (req.body.categoreydrop !== "") {
    catone = req.body.categoreydrop;
  }
  if (req.body.branddrop === "") {
    brandone = req.body.brandone;
  }
  if (req.body.branddrop !== "") {
    brandone = req.body.branddrop;
  }

  try {
    subcategoreyTemplatecopy
      .find({ categoreyno: catone, brandno: brandone })
      .populate("categoreyno", "categoreyname")
      .populate("brandno", "brandname")
      .exec((err, subcatdata) => {
        if (err) {
          resp.json({ message: "subcategorey none" });
        } else {
          resp.json({ message: "subcategorey list", data: subcatdata });
          console.log(subcatdata);
        }
      });
  } catch (error) {
    return resp
      .status(400)
      .json({ error: err, message: "Error fetching data" });
  }
});

// TO UPDATE SUBCATEGOREY IN SUBCATEGOREY TABLE

router.put("/subcategoreyUpdate", async (req, resp) => {
  try {
    console.log(req.body);

    subcategoreyTemplatecopy
      .findOne({
        subcategoreyname: req.body.subcatname,
        categoreyno: req.body.categoreydrop,
        brandno: req.body.branddrop,
      })
      .exec((err, productData) => {
        if (err) {
          resp.json({ message: "server error " });
        } else {
          if (productData) {
            resp.json({ message: "subcategorey alreday exist" });
          }
          if (!productData) {
            const query = { subcategoreyid: req.body.subcategoreyid };
            // Set some fields in that document
            const update = {
              $set: {
                subcategoreyname: req.body.subcatname,
                categoreyno: req.body.categoreydrop,
                brandno: req.body.branddrop,
              },
            };
            // Return the updated document instead of the original document
            const options = { returnNewDocument: true };
            return subcategoreyTemplatecopy
              .findOneAndUpdate(query, update, options)
              .then((updatedDocument) => {
                if (updatedDocument) {
                  resp.status(200).json({ message: "subcategorey updated" });

                  console.log(
                    `Successfully updated document: ${updatedDocument}.`
                  );
                } else {
                  resp
                    .status(200)
                    .json({ message: "subcategorey not updated" });
                  console.log("brand not valid.");
                }
                return updatedDocument;
              })
              .catch((err) =>
                console.error(`Failed to find and update document: ${err}`)
              );
          }
        }
      });
  } catch (error) {
    return resp.status(400).json({ error: error, message: "Error updating" });
  }
});

//                                                   PRODUCT ROUTES
//                                                    -----------

router.post("/productAdd", async (req, resp) => {
  console.log(req.body);
  const url = "not uploaded";
  const productId = uuidv4();
  try {
    productTemplatecopy
      .findOne({
        productname: req.body.product,
        subcatno: req.body.subcatid,
        categoreyno: req.body.categoreyid,
        brandno: req.body.brandid,
        size: req.body.size,
        color: req.body.color,
      })
      .exec((err, productData) => {
        if (err) {
          resp.json({ message: "product error " });
          console.log(err);
        } else {
          if (productData) {
            resp.json({ message: "product alreday exist" });
          }
          if (!productData) {
            // add to subcategorey
            const productinstance = new productTemplatecopy({
              productid: productId,
              productname: req.body.product,
              categoreyno: req.body.categoreyid,
              brandno: req.body.brandid,
              subcatno: req.body.subcatid,
              size: req.body.size,
              units: req.body.units,
              quantity: req.body.quantity,
              unitprice: req.body.unitprice,
              color: req.body.color,
              description: req.body.description,
              expdate: req.body.date,
              url: url,
            });
            console.log(req.body);
            productinstance
              .save()
              .then((data) => {
                resp.status(200).json({ message: "product added", DATA: data });
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
      .json({ error: error, message: "Error fetching data" });
  }
});

router.get("/productGet", async (req, resp) => {
  try {
    productTemplatecopy
      .find({ Status: "Active" })
      .populate("categoreyno", "categoreyname")
      .populate("brandno", "brandname")
      .populate("subcatno", "subcategoreyname")
      .exec((err, productdata) => {
        if (err) {
          resp.json({ message: "product none" });
        } else {
          resp.json(productdata);
        }
      });
  } catch (error) {
    return resp
      .status(400)
      .json({ error: err, message: "Error fetching data" });
  }
});

// delete

router.delete("/productdelete", async (req, resp) => {
  try {
    console.log(req.query)
    const query = { _id: req.query.proid, Status: "Active" };
    const update = {
      $set: {
        Status: "INActive",
      },
    };
    const options = { returnNewDocument: true };
    return productTemplatecopy
      .findOneAndUpdate(query, update, options)
      .then((updatedDocument) => {
        if (updatedDocument) {
          resp.status(200).json({ message: "Product deleted" });
          console.log(`Successfully updated document: ${updatedDocument}.`);
        } else {
          resp.status(200).json({ message: "Product not deleted" });
        }
        return updatedDocument;
      })
      .catch((err) =>
        console.error(`Failed to find and update document: ${err}`)
      );
  } catch (error) {
    return resp.status(400).json({ error: error, message: "Error updating" });
  }
});

router.post("/filterporduct", async (req, resp) => {
  try {
    productTemplatecopy
      .find({
        categoreyno: req.body.categoreydrop,
        brandno: req.body.branddrop,
        Status: "Active",
      })
      .populate("categoreyno", "categoreyname")
      .populate("brandno", "brandname")
      .populate("subcatno", "subcategoreyname")
      .exec((err, productdata) => {
        if (err) {
          resp.json({ message: "product none" });
        } else {
          resp.json(productdata);
        }
      });
  } catch (error) {
    return resp
      .status(400)
      .json({ error: err, message: "Error fetching data" });
  }
});

router.put("/stockupdate", async (req, resp) => {
  try {
    console.log(req.body);
    const query = { productid: req.body.productid, Status: "Active" };
    // Set some fields in that document
    const update = {
      $inc: {
        quantity: +req.body.quantity,
      },
    };
    // Return the updated document instead of the original document
    const options = { returnNewDocument: true };
    return productTemplatecopy
      .findOneAndUpdate(query, update, options)
      .then((updatedDocument) => {
        if (updatedDocument) {
          resp.status(200).json({ message: "stock updated" });

          console.log(`Successfully updated document: ${updatedDocument}.`);
        } else {
          resp.status(200).json({ message: "stock not updated" });
          console.log("brand not valid.");
        }
        return updatedDocument;
      })
      .catch((err) =>
        console.error(`Failed to find and update document: ${err}`)
      );
  } catch (error) {
    return resp.status(400).json({ error: error, message: "Error updating" });
  }
});

router.put("/productstep1", async (req, resp) => {
  try {
    subcategoreyTemplatecopy
      .findOne({
        categoreyno: req.body.categoreydrop,
        brandno: req.body.branddrop,
      })
      .exec((err, subCatdata) => {
        if (err) {
          resp.json({ message: "subcategorey error " });
        } else {
          if (!subCatdata) {
            resp.json({ message: "This combination dont exist" });
          }
          if (subCatdata) {
            const query = { productid: req.body.productid, Status: "Active" };
            // Set some fields in that document
            const update = {
              $set: {
                categoreyno: req.body.categoreydrop,
                brandno: req.body.branddrop,
              },
            };
            // Return the updated document instead of the original document
            const options = { returnNewDocument: true };
            return productTemplatecopy
              .findOneAndUpdate(query, update, options)
              .then((updatedDocument) => {
                if (updatedDocument) {
                  resp.status(200).json({ message: "updated" });

                  console.log(
                    `Successfully updated document: ${updatedDocument}.`
                  );
                } else {
                  resp.status(200).json({ message: "not updated" });
                  console.log("not valid.");
                }
                return updatedDocument;
              })
              .catch((err) =>
                console.error(`Failed to find and update document: ${err}`)
              );
          }
        }
      });
  } catch (error) {
    return resp.status(400).json({ error: error, message: "Error updating" });
  }
});

router.put("/productstep2", async (req, resp) => {
  try {
    const query = { productid: req.body.productid, Status: "Active" };
    // Set some fields in that document
    const update = {
      $set: {
        subcatno: req.body.subcatdrop,
      },
    };
    // Return the updated document instead of the original document
    const options = { returnNewDocument: true };
    return productTemplatecopy
      .findOneAndUpdate(query, update, options)
      .then((updatedDocument) => {
        if (updatedDocument) {
          resp.status(200).json({ message: "updated" });

          console.log(`Successfully updated document: ${updatedDocument}.`);
        } else {
          resp.status(200).json({ message: "not updated" });
          console.log("not valid.");
        }
        return updatedDocument;
      })
      .catch((err) =>
        console.error(`Failed to find and update document: ${err}`)
      );
  } catch (error) {
    return resp.status(400).json({ error: error, message: "Error updating" });
  }
});

router.put("/productstep3", async (req, resp) => {
  try {
    console.log(req.body);

    productTemplatecopy
      .findOne({
        productid: req.body.productid,
        Status: "Active",
      })
      .exec((err, productData) => {
        if (err) {
          resp.json({ message: "server error " });
        } else {
          if (!productData) {
            resp.json({ message: "No product Found" });
          }
          if (productData) {
            const query = { productid: req.body.productid, Status: "Active" };
            // Set some fields in that document
            const update = {
              $set: {
                productname: req.body.product,
                size: req.body.size,
                units: req.body.units,
                quantity: req.body.quantity,
                unitprice: req.body.unitprice,
                color: req.body.color,
                description: req.body.description,
              },
            };
            // Return the updated document instead of the original document
            const options = { returnNewDocument: true };
            return productTemplatecopy
              .findOneAndUpdate(query, update, options)
              .then((updatedDocument) => {
                if (updatedDocument) {
                  resp.status(200).json({ message: "updated" });

                  console.log(
                    `Successfully updated document: ${updatedDocument}.`
                  );
                } else {
                  resp.status(200).json({ message: "not updated" });
                  console.log("not valid.");
                }
                return updatedDocument;
              })
              .catch((err) =>
                console.error(`Failed to find and update document: ${err}`)
              );
          }
        }
      });
  } catch (error) {
    return resp.status(400).json({ error: error, message: "Error updating" });
  }
});

router.put("/imageupload", async (req, resp) => {
  try {
    console.log(req.body);
    const query = { productid: req.body.productid, Status: "Active" };
    // Set some fields in that document
    const update = {
      $set: {
        url: req.body.url,
      },
    };
    // Return the updated document instead of the original document
    const options = { returnNewDocument: true };
    return productTemplatecopy
      .findOneAndUpdate(query, update, options)
      .then((updatedDocument) => {
        if (updatedDocument) {
          resp.status(200).json({ message: "image updated" });
          console.log(`Successfully updated document: ${updatedDocument}.`);
        } else {
          resp.status(200).json({ message: "image not updated" });
          console.log("image not valid.");
        }
        return updatedDocument;
      })
      .catch((err) =>
        console.error(`Failed to find and update document: ${err}`)
      );
  } catch (error) {
    return resp.status(400).json({ error: error, message: "Error updating" });
  }
});

//                                                      Rating
//                                                    ----------

router.post("/rateinsert", async (req, resp) => {
  try {
    RateTemplatecopy.findOne({ prodid: req.body.prodid }).exec(
      (err, chatdata) => {
        if (err) {
          resp.json({ message: " error " });
        } else {
          if (chatdata) {
            const query = { prodid: req.body.prodid };
            const update = {
              $push: {
                rates: [
                  {
                    rates: req.body.rates,
                  },
                ],
              },
            };
            const options = { new: true };
            return RateTemplatecopy.findOneAndUpdate(
              query,
              update,
              options
            ).then((updatedDocument) => {
              if (updatedDocument) {
                // resp.status(200).json({ message: "message sended"});
                let total = 0;
                let ratesarr = updatedDocument.rates.map((item) => {
                  return item.rates;
                });
                let totarating = updatedDocument.rates.map((item) => {
                  return (total = total + parseInt(item.rates));
                });
                let length = Object.keys(ratesarr).length;
                let newtotal = (total / length).toFixed(1);

                const query = { _id: req.body.prodid };
                const update = {
                  $set: {
                    Totalrating: newtotal,
                    noofpeople: length,
                  },
                };
                const options = { returnNewDocument: true };
                return productTemplatecopy
                  .findOneAndUpdate(query, update, options)
                  .then((productdata) => {
                    if (productdata) {
                      const query = { _id: req.body.cartid };
                      const update = {
                        $set: {
                          rated: "rated",
                        },
                      };
                      const options = { returnNewDocument: true };
                      return cartTemplatecopy
                        .findOneAndUpdate(query, update, options)
                        .then((cartdata) => {
                          if (cartdata) {
                            resp.status(200).json({ message: "rate added" });
                          } else {
                            resp
                              .status(200)
                              .json({ message: "cart table not updated" });
                          }
                        })
                        .catch((err) =>
                          console.error(
                            `Failed to find and update document: ${err}`
                          )
                        );
                    } else {
                      resp
                        .status(200)
                        .json({ message: "product table not updated" });
                      console.log("product table not updated");
                    }
                    return productdata;
                  })
                  .catch((err) =>
                    console.error(`Failed to find and update document: ${err}`)
                  );
              } else {
                resp.status(200).json({ message: "rate not added" });
                console.log("rate not added");
              }
              return updatedDocument;
            });
          }
          if (!chatdata) {
            const chattinstance = new RateTemplatecopy({
              prodid: req.body.prodid,
              rates: [
                {
                  rates: req.body.rates,
                },
              ],
            });
            console.log(req.body);
            chattinstance
              .save()
              .then((data) => {
                if (data) {
                  const query = { _id: req.body.prodid };
                  const update = {
                    $set: {
                      Totalrating: req.body.rates,
                      noofpeople: 1,
                    },
                  };
                  const options = { returnNewDocument: true };
                  return productTemplatecopy
                    .findOneAndUpdate(query, update, options)
                    .then((productdata) => {
                      if (productdata) {
                        const query = { _id: req.body.cartid };
                        const update = {
                          $set: {
                            rated: "rated",
                          },
                        };
                        const options = { returnNewDocument: true };
                        return cartTemplatecopy
                          .findOneAndUpdate(query, update, options)
                          .then((cartdata) => {
                            if (cartdata) {
                              resp.status(200).json({ message: "rate added" });
                            } else {
                              resp
                                .status(200)
                                .json({ message: "cart table not updated" });
                            }
                          })
                          .catch((err) =>
                            console.error(
                              `Failed to find and update document: ${err}`
                            )
                          );
                      } else {
                        resp
                          .status(200)
                          .json({ message: "product table not updated" });
                        console.log("product table not updated");
                      }
                      return productdata;
                    })
                    .catch((err) =>
                      console.error(
                        `Failed to find and update document: ${err}`
                      )
                    );
                } else {
                  resp.status(400).json({ message: "rate not added" });
                }
              })
              .catch((error) => {
                resp.status(400).json({ error: error, message: " error " });
              });
          }
        }
      }
    );
  } catch (error) {
    return resp.status(400).json({ error: error, message: "Error updating" });
  }
});

//                                                       serach product
//                                                      ------------
router.get("/search", async (req, resp) => {
  try {
    const query = req.query.search;
    productTemplatecopy
      .find({ productname: new RegExp(query, "i"), Status: "Active" })
      .populate("categoreyno", "categoreyname")
      .populate("brandno", "brandname")
      .populate("subcatno", "subcategoreyname")
      .exec((err, productdata) => {
        if (err) {
          resp.json({ message: "product none" });
        } else {
          resp.json(productdata);
        }
      });
  } catch (error) {
    return resp
      .status(400)
      .json({ error: error, message: "Error fetching data" });
  }
});

module.exports = router;
