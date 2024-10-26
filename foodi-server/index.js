const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors')
const app = express()
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config()
const port = process.env.port || 6001
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
//console.log(process.env.ACCESS_TOKEN_SECRET)

//middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

//mongodb configuration using mongoose

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mayurgaikwad098.s2ldg.mongodb.net/foodi-client-db?retryWrites=true&w=majority&appName=Mayurgaikwad098`)
.then(
    console.log("mongoose connected successfully")
)
.catch((error)=>console.log("Error connecting to mongodb",error));

//JWT AUTHENTICATION
app.post('/jwt',async(req,res)=>{
  const user =req.body;
  const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{
    expiresIn:'1h'
  }) 
  res.send({token});
})
//console.log(crypto.randomBytes(64).toString('hex'));


//imports routes here
const menuRoutes = require('./api/routes/menuRoutes');
const cartRoutes = require('./api/routes/cartRoutes');
const userRoutes = require('./api/routes/userRoutes');
const verifyToken = require('./api/middleware/verifyToken');
const paymentRoutes = require('./api/routes/paymentRoutes');
app.use('/menu', menuRoutes)
app.use('/carts', cartRoutes)
app.use('/users', userRoutes)
app.use('/payment', paymentRoutes)


//stripe payments routes
app.post("/create-payment-intent", async (req, res) => {
  const { price } = req.body;
  const amount = price*100;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",

    payment_method_types: ["card"],
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.get('/',verifyToken,(req, res) => {
  res.send('Hello Foodi client server!')
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})