require('dotenv').config()
const mongoose = require('mongoose');
const { Schema } = require('zod');

mongoose.connect(process.env.MONGO_URL);

const userschema = new mongoose.Schema({
      username:String,
      password:String,
      name:String
})

const AccountSchema = new mongoose.Schema({
      userId : {
            type:mongoose.Schema.Types.ObjectId,
            ref:'user',
            required:true
        },
      balance:{
          type:Number,
          required:true
      }
})


const user = mongoose.model('User',userschema);
const account = mongoose.model('balance',AccountSchema);

module.exports = {user,account};