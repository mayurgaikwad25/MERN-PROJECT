const express = require('express')
const router = express.Router()
const Cart = require('../model/Carts')
const cartController = require('../controllers/cartControllers')
const verifyToken = require('../middleware/verifyToken')

//get all cart items from db
router.get('/',verifyToken,cartController.getCartByEmail);
router.post('/',cartController.addToCart); 
router.delete('/:id',cartController.deleteCart);
router.put('/:id',cartController.updateCart); 
router.get('/:id',cartController.getSingleCart);

module.exports= router;