const express = require("express");
const rootRouter = require("./router/index");
const body = require('body-parser')
const app = express();
const cors = require('cors')

app.use(cors())
app.use(body.json());

app.use("/api/v1", rootRouter);

const port = 3001;

app.listen(port,()=>{
    console.log("server is runing !")
})