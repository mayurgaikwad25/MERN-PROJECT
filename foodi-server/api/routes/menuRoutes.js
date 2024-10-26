const express = require('express')
const router = express.Router()
const Menu = require('../model/Menu');
const menuController  = require('../controllers/menuControllers')

//get all menu items from db
router.get('/',menuController.getAllMenuItems)

//post a menu item
router.post('/',menuController.postMenuItem)

//delete a menu item
router.delete('/:id',menuController.deleteMenuItem)

// get single menu item
router.get('/:id', menuController.singleMenuItem);

// update single menu item
router.patch('/:id', menuController.updateMenuItem);

module.exports= router; 