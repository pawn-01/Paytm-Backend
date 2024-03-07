const {user,account} = require("../db");
const express = require("express");
const authmiddleware = require("../middleware");
const router = express.Router();
const mongoose = require("mongoose")

router.get("/balance",authmiddleware,async(req,res)=>{
       const userId = req.userId;
       console.log(userId);

       const u1 = await account.findOne({userId});
       const u = await user.findOne({_id:userId});

       res.json({
          username:u.name,
          balance:u1.balance
       })
})

router.post("/transfer",authmiddleware,async (req,res)=>{

    const session = await mongoose.startSession();
     session.startTransaction();

     const amount = req.body.amount;
     if(amount<0){
        await session.abortTransaction();
       return res.json({
           messeage:"Input is wrong",
           flag:0
        })
     }

     const userfrom = await account.findOne({userId:req.userId}).session(session);
    
     if(userfrom.balance < amount){
        await session.abortTransaction();
        return res.json({
            messeage:"Insufficient Balance",
            flag:0
         })
     }
     else{
        const userto = await account.findOne({userId:req.body.to}).session(session);

        if(!userto){
            await session.abortTransaction();
            return res.json({
                messeage:"User Not Exist"
             })
        }
        
        await account.updateOne({userId:userfrom.userId},{
            $inc:{
                balance: -amount
            }
        }).session(session)

        await account.updateOne({userId:userto.userId},{
            $inc:{
               balance: amount
            }
        }).session(session)
     }

     await session.commitTransaction();

     res.json({
        messeage:"transcation done..",
        flag:1
     })
})


module.exports = router;