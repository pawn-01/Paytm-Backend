const express = require('express')
const router = express.Router();
const {user,account} = require('../db');
const {z} = require('zod');
const jwt = require("jsonwebtoken");
const jwt_secretkey = require("../jwt")
const authmiddleware = require('../middleware'); 

function check(req,res,next){
    const username = z.string();
    const password = z.string();
    const name = z.string();

    if(!username.safeParse(req.body.username).success || !password.safeParse(req.body.password).success || !name.safeParse(req.body.name)){
        res.json({
            message:"Inputs are incorrect"
        })
    }
    else{
        next()
    }
}

router.post("/signup",check, async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;

    if(username=="" || password=="" || name==""){
        return res.status(403).json({
             message:"Inputs are incorrect",
             int:-1
         })
    }

    const a = await user.find({username});

    if(a.length>=1){
        res.status(403).json({
            message:"user is already exist",
            int:0
        })
    }
    else{
        const u1 = await user.create({
            username,
            password,
            name
         })

       const a1 = await account.create({
           userId:u1._id,
           balance:Math.floor(Math.random()*10000)
       })

       const token = jwt.sign({
        userId:u1._id
        },jwt_secretkey)
      
       res.json({
        message:"signin sucessfully",
        token:token,
        int:1
       })
    }
})

router.post("/signin",check,async (req,res)=>{
      const username = req.body.username;
      const password = req.body.password;
  
      const a = await user.findOne({
        username:username,
        password:password
    });


      if(a){
        const token = jwt.sign({
             userId:a._id
        },jwt_secretkey)
       
        res.json({
            message:"signin sucessfully",
            token:token,
            int:1
        })
      }
    else{
      res.json({
        message:"user not exist",
        int:0
      })
    }

})

router.put("/update",authmiddleware ,async (req,res)=>{
        let password = z.string();
        if(!password.safeParse(req.body.password).success){
             res.status(403).json({
                message:"something goes wrong"
             })
        }

        password = req.body.password;
        const name = req.body.name;

        const query = await user.updateOne({id:req.user_id},{password,name})

        if(!query.modifiedCount){
             res.status(411).json({
                message:"Error while updating information"
             })
        }
       else{
         res.json({
            message:"updated successfully"
         })
      }
})

router.get("/bulk", authmiddleware , async (req, res) => {

        const filter = req.query.filter;

        const users = await user.find({
              name: {
                    "$regex": filter
                }
        })
       
        console.log(users);

        res.json({
            user: users.filter((user)=>{
                 if(user._id!=req.userId){
                    return{
                        username: user.username,
                        name:user.name,
                       _id: user._id}
                    }
            })
        })
    })

router.post("/me" , authmiddleware , (req,res)=>{
      res.json({
        flag:true
      })
})

module.exports = router;