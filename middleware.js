const jwt = require('jsonwebtoken');
const secretKey = require("./jwt");

function authmiddleware(req,res,next){
       const auth =  req.headers.authorization;

       console.log(auth);
       
       if(!auth || !auth.startsWith("Bearer")){
          return res.status(403).json({
            messeage:"kya hui",
            flag:false
          });
       } 

       const token = auth.split(" ")[1];

       jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
              return res.status(403).json({
                messeage:"Somthing is wrong",
                flag:false
              })
           } 
        else {
             req.userId = decoded.userId;
             next();
        }})
}

module.exports = authmiddleware;