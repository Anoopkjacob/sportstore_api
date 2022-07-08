const express = require("express");
const router = express.Router();
const signUpTemplatecopy = require("../models/SignUpModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();


// to register the user

router.post("/signup", async (req, resp) => {
  console.log(req.body)
  try {
    var status="INACTIVE";

    if (req.body.usetype != "supplier") {
      req.body.companyname = "";
      req.body.branch = "";
      req.body.badgge = "";
      req.body.licence="";
      status="ACTIVE "
    }
    const salt = await bcrypt.genSalt(10);
    const securepassword = await bcrypt.hash(req.body.password, salt);

    signUpTemplatecopy
      .findOne({ email: req.body.email })
      .exec((err, productData) => {
        if (err) {
          resp.json({ message: "server error " });
          console.log(err)
        } else {
          if (productData) {
            resp.json({ message: "email alreday exist" });
          }
          if (!productData) {

            // jwt otp

            let info = { email: req.body.email, password: securepassword };
            const token = jwt.sign(info, process.env.JWTSECRETKEY,{ expiresIn: 5 * 60 });
            let url = `http://localhost:5000/app/verify?token=${token}`;
            console.log(url)
            const transport = nodemailer.createTransport({
              host: process.env.MAIL_HOST,
              auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
              },
            });
            var mailoptions = {
              from: process.env.MAIL_FROM,
              to: req.body.email,
              subject: "Email verification",
              html: `<h3><a href="${url}">click here to verify email</a></h3>`,
            };

           transport.sendMail(mailoptions, function (err,response){
              if (err) {
                console.log(err)
                resp.status(200).json({ error: err, message: "email server error" });
              } else {
                const signUpUser = new signUpTemplatecopy({
                  name: req.body.name,
                  email: req.body.email,
                  phone: req.body.phone,
                  password: securepassword,
                  address: req.body.address,
                  city: req.body.city,
                  zip: req.body.zip,
                  usetype: req.body.usetype,
                  companyname: req.body.companyname,
                  branch: req.body.branch,
                  badge: req.body.badgge,
                  licence:req.body.licence,
                  status:status,
                  url: "Add profilepic",
                  OTP: token,
                });

                console.log(req.body);
                signUpUser
                  .save()
                  .then((data) => {
                    resp.status(200).json({ message: "user registered" });
                  })
                  .catch((error) => {
                    resp.status(400).json({ error: error, message: " error " });
                  });
              }
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

// staffreg & deliverboy

router.post("/staffreg", async (req, resp) => {
  try {
 
    const salt = await bcrypt.genSalt(10);
    const securepassword = await bcrypt.hash(req.body.password, salt);

    signUpTemplatecopy
      .findOne({ email: req.body.email })
      .exec((err, productData) => {
        if (err) {
          resp.json({ message: "server error " });
        } else {
          if (productData) {
            resp.json({ message: "email alreday exist" });
          }
          if (!productData) {

            const transport = nodemailer.createTransport({
              host: process.env.MAIL_HOST,
              auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
              },
            });
            var mailoptions = {
              from: process.env.MAIL_FROM,
              to: req.body.email,
              subject: "STAFF Credintials",
              html: `<p>email:${req.body.email}</br>
               password:${req.body.password}
              </p>`,
            };

           transport.sendMail(mailoptions, function (err,response){
              if (err) {
                console.log(err)
                resp
                  .status(200)
                  .json({ error: err, message: "email server error" });
              } else {
                const signUpUser = new signUpTemplatecopy({
                  name: req.body.name,
                  email: req.body.email,
                  phone: req.body.phone,
                  password: securepassword,
                  address: req.body.address,
                  city: req.body.city,
                  zip: req.body.zip,
                  usetype: req.body.usetype,
                  companyname: "",
                  branch: "",
                  badge: "",
                  licence:req.body.licence,
                  status:"ACTIVE ",
                  url: "Add profilepic",
                  OTP: "verified",
                });

                console.log(req.body);
                signUpUser
                  .save()
                  .then((data) => {
                    resp.status(200).json({ message: "user registered" });
                  })
                  .catch((error) => {
                    resp.status(400).json({ error: error, message: " error " });
                  });
              }
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

// to login

router.post("/signin", async (req, resp) => {
  try {
    signUpTemplatecopy
      .findOne({ email: req.body.email })
      .then((signUpTemplatecopy) => {
        if (signUpTemplatecopy) {
          bcrypt.compare(
            req.body.password,
            signUpTemplatecopy.password,
            (err, result) => {
              if (err) {
                resp.status(200).json({ error: err, message: "server error" });
              }
              if (result) {
                resp.status(200).json({
                  message: "validuser",
                  email: req.body.email,
                  data: signUpTemplatecopy,
                });
                console.log("sucess login");
              }
              if (!result) {
                resp.status(200).json({
                  message: "invalid password",
                });
                console.log("invalid password");
              }
            }
          );
        } else {
          resp.status(200).json({
            message: "invalid Email",
          });
          console.log("invalid Email");
        }
      });
  } catch (error) {
    console.log("email error");
    return resp
      .status(400)
      .json({ error: err, message: "email and password needed" });
  }
});

// to verify
router.get("/verify" ,async (req, resp) => {
 jwt.verify(req.query.token,process.env.JWTSECRETKEY,function(err, decoded) {
  if (err) {
    console.log(err.message)
      resp.send(`<html> 
        <body>
        <h1>${err.message}</h1>
        </body>
    </html>`);
  }
  else{            
    const query = { email: decoded.email,password:decoded.password };
    const update = {
      $set: {
        OTP: "verified"
      },
    };
    const options = { returnNewDocument: true };
    return signUpTemplatecopy
      .findOneAndUpdate(query, update, options)
      .then((updatedDocument) => {
        if (updatedDocument) {
             resp.send(`<html> 
              <body>
              <h1>Email verified</h1></br>
              <p><a href="http://localhost:3000/login">click here</a></p>
              </body>
          </html>`);

        } else {
          resp.status(200).json({ message: "server error" });
        }
        return updatedDocument;
      })
      .catch((err) =>
        console.error(`Failed to find and update document: ${err}`)
      ); 
  }
});
});


// to otp resend


router.post("/otpresend", async (req, resp) => {
  try {
    signUpTemplatecopy
      .findOne({ email: req.body.email })
      .then((signUpTemplatecopy,err) => {
        if (err) {
          resp.json({ message: "server error " });
        } 
        if (signUpTemplatecopy) {
              if (signUpTemplatecopy.OTP==="verified") {
                resp.status(200).json({ error: err, message: "Alearedy verified" });
              }else{

                let info = { email: req.body.email, password: signUpTemplatecopy.password };
                const token = jwt.sign(info, process.env.JWTSECRETKEY,{ expiresIn: 5 * 60 });
                let url = `http://localhost:5000/app/verify?token=${token}`;
  
          
            const transport = nodemailer.createTransport({
                host: process.env.MAIL_HOST,
                auth: {
                  user: process.env.MAIL_USER,
                  pass: process.env.MAIL_PASS,
                },
              });
              var mailoptions = {
                from: process.env.MAIL_FROM,
                to: req.body.email,
                subject: "Email verification (OTP resend)",
                html: `<h3><a href="${url}">click here to verify email</a></h3>`,
              };
  
             transport.sendMail(mailoptions, function (err,response){
                if (err) {
                  console.log(err)
                  resp.status(200).json({ error: err, message: "email server error" });
                } else {
                  resp.status(200).json({
                    message: "resended"
                  });
                  console.log("resended");
                }
              });
            } 
        } else {
          resp.status(200).json({
            message: "invalid Email",
          });
          console.log("invalid Email");
        }
      });
  } catch (error) {
    console.log("email error");
    return resp
      .status(400)
      .json({ error: err, message: "email and password needed" });
  }
});

// forgot passwword

router.post("/forgotpassword", async (req, resp) => {
  try {
    signUpTemplatecopy
      .findOne({ email: req.body.email })
      .then((signUpTemplatecopy,err) => {
        if (err) {
          resp.json({ message: "server error " });
        } 
        if (signUpTemplatecopy) {
              if (signUpTemplatecopy.OTP!=="verified") {
                resp.status(200).json({ error: err, message: "NoT verified email" });
              }else{

                let info = { email: req.body.email, password: signUpTemplatecopy.password };
                const token = jwt.sign(info, process.env.JWTSECRETKEY,{ expiresIn: 5 * 60 });

            const transport = nodemailer.createTransport({
                host: process.env.MAIL_HOST,
                auth: {
                  user: process.env.MAIL_USER,
                  pass: process.env.MAIL_PASS,
                },
              });
              var mailoptions = {
                from: process.env.MAIL_FROM,
                to: req.body.email,
                subject: "Forgot password",
                html: `<h3>Copy this Token:-> <br>
                  <strong>${token}</strong></h3><br>
                 <p>copy and paste above token </p>`,
              };
  
             transport.sendMail(mailoptions, function (err,response){
                if (err) {
                  console.log(err)
                  resp.status(200).json({ error: err, message: "email server error" });
                } else {
                  resp.status(200).json({
                    message: "Token sended",
                    token:"tokensended",
                  });
                  console.log("tokensended");
                }
              });
            } 
        } else {
          resp.status(200).json({
            message: "Email is not Registered",
          });
          console.log("invalid Email");
        }
      });
  } catch (error) {
    console.log("email error");
    return resp
      .status(400)
      .json({ error: err, message: "email and password needed" });
  }
});
// forgot and change two new password

router.post("/newpassword" ,async (req, resp) => {

  const salt = await bcrypt.genSalt(10);
  const securepassword = await bcrypt.hash(req.body.newpassword, salt);

  jwt.verify(req.body.token,process.env.JWTSECRETKEY,function(err, decoded) {
   if (err) {
    resp.json({ message: err.message });
   }
   else{ 
     const query = { email: decoded.email,password:decoded.password };
     const update = {
       $set: {
         password:securepassword
       },
     };
     const options = { returnNewDocument: true };
     return signUpTemplatecopy
       .findOneAndUpdate(query, update, options)
       .then((updatedDocument) => {
         if (updatedDocument) {
          resp.json({ message: "password updated"});
 
         } else {
           resp.status(200).json({ message: "server error" });
         }
         return updatedDocument;
       })
       .catch((err) =>
         console.error(`Failed to find and update document: ${err}`)
       ); 
   }
 });
 });
 

// to get informatiopn about a user with given email in profile pages

router.post("/profileGet", async (req, resp) => {
  try {
    signUpTemplatecopy
      .findOne({ email: req.body.email })
      .exec((err, userdata) => {
        if (err) {
          req.json({ message: "user not found" });
          res.redirect("/");
        } else {
          resp.json(userdata);
        }
      });
  } catch (error) {
    return resp
      .status(400)
      .json({ error: err, message: "Error fetching data" });
  }
});

// to edit the profile

router.put("/profileEdit", async (req, resp) => {
  try {
    console.log(req.body);
    if (req.body.password !== "") {
      salt = await bcrypt.genSalt(10);
      passvalue = await bcrypt.hash(req.body.password, salt);
    } else if (req.body.password === "") {
      passvalue = req.body.hash;
    }

    const query = { email: req.body.email };
    // Set some fields in that document
    const update = {
      $set: {
        name: req.body.name,
        phone: req.body.phone,
        password: passvalue,
        address: req.body.address,
        city: req.body.city,
        zip: req.body.zip,
      },
    };
    // Return the updated document instead of the original document
    const options = { returnNewDocument: true };
    return signUpTemplatecopy
      .findOneAndUpdate(query, update, options)
      .then((updatedDocument) => {
        if (updatedDocument) {
          resp.status(200).json({ message: "profile updated" });

          console.log(`Successfully updated document: ${updatedDocument}.`);
        } else {
          resp.status(200).json({ message: "profile not updated" });
          console.log("No document matches the provided email.");
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

//profile company data 

router.put("/companyEdit", async (req, resp) => {
  try {
    const query = { email: req.body.email };
    // Set some fields in that document
    const update = {
      $set: {
        companyname: req.body.companyname,
        branch: req.body.branch,
         badge: req.body.badgge,
        licence: req.body.licence,
      },
    };
    // Return the updated document instead of the original document
    const options = { returnNewDocument: true };
    return signUpTemplatecopy
      .findOneAndUpdate(query, update, options)
      .then((updatedDocument) => {
        if (updatedDocument) {
          resp.status(200).json({ message: "profile updated" });

          console.log(`Successfully updated document: ${updatedDocument}.`);
        } else {
          resp.status(200).json({ message: "profile not updated" });
          console.log("No document matches the provided email.");
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


// complete user data from admin panel

router.get("/userdata", async (req, resp) => {
  try {

    signUpTemplatecopy
      .find({ usetype: { $ne: "Admin" },usetype:req.query.usertype })
      .exec((err, usersdata) => {
        if (err) {
          req.json({ message: "No users found" });
          res.redirect("/home");
        } else {
          resp.json(usersdata);
        }
      });
  } catch (error) {
    return resp
      .status(400)
      .json({ error: err, message: "Error fetching data" });
  }
});

//activat and seactivate user in admin panel

router.put("/profileActivate", async (req, resp) => {
  try {
    console.log(req.body);
    const query = { email: req.body.email };
    // Set some fields in that document
    const update = {
      $set: {
        status: req.body.action,
      },
    };
    // Return the updated document instead of the original document
    const options = { returnNewDocument: true };
    return signUpTemplatecopy
      .findOneAndUpdate(query, update, options)
      .then((updatedDocument) => {
        if (updatedDocument) {
          resp
            .status(200)
            .json({ message: `Successfullly ${req.body.action}` });

          console.log(`Successfully updated document: ${updatedDocument}.`);
        } else {
          resp
            .status(200)
            .json({ message: `Unsuccessfullly ${req.body.action}` });
          console.log("No user found");
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

router.get("/supplierprofile", async (req, resp) => {
  try {
    signUpTemplatecopy.find({ usetype: "supplier" }).exec((err, userdata) => {
      if (err) {
        req.json({ message: "supplier not found" });
        res.redirect("/");
      } else {
        resp.json(userdata);
      }
    });
  } catch (error) {
    return resp
      .status(400)
      .json({ error: err, message: "Error fetching data" });
  }
});

router.put("/imageupload", async (req, resp) => {
  try {
    console.log(req.body);
    const query = { _id: req.body.id };
    // Set some fields in that document
    const update = {
      $set: {
        url: req.body.url,
      },
    };
    // Return the updated document instead of the original document
    const options = { returnNewDocument: true };
    return signUpTemplatecopy
      .findOneAndUpdate(query, update, options)
      .then((updatedDocument) => {
        if (updatedDocument) {
          resp.status(200).json({ message: "profile updated" });
          console.log(`Successfully updated document: ${updatedDocument}.`);
        } else {
          resp.status(200).json({ message: "profile not updated" });
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

module.exports = router;
