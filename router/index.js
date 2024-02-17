const express = require('express')
const router = express.Router();
const userRoute = require("./userrouter");
const accountrouter = require("./account");

router.use('/user',userRoute);
router.use('/account',accountrouter);

module.exports = router