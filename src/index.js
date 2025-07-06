const express=require("express");
require("dotenv/config");
const restrouter = require("./api");
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const app=express();
const cors=require('cors');

const { putobject } = require("./cloudinary");
require('./passport')
const PORT=process.env.SERVER_PORT;


app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json({limit:'50mb'}))
app.use(cors({
  origin:true,
  credentials:true
}))
app.options('*', (req, res) => {
  console.log('OPTIONS preflight hit');
  res.sendStatus(204);
});


app.use(express.json())
app.use(
    session({
      secret: "config.app.secret",
      resave: true,
      saveUninitialized: true,
    })
  );
app.use(passport.initialize());
app.use(passport.session());


app.use('/api',restrouter)


app.get('/',(req,res)=>{
   
    res.json("hello")
})

 app.listen(PORT,()=>{
     console.log(`port is running on port ${PORT}`)
})


// module.exports=app;
