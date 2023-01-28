const connectToMongo = require('./db');
const express = require('express');
const app = express();
const port = 5000;
connectToMongo();
app.use(express.json());
app.use('/auth',require('./routes/auth'))
app.get("/",(req,res)=>{
    res.send("Hello Harsh");
})
app.listen(port,()=>{
    console.log(`Node app listening on port http://localhost:${port}`);
})
