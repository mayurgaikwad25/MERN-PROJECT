const Menu = require("../model/Menu");
const mongoose = require('mongoose');

const getAllMenuItems = async(req, res) => {
    try {
        const menus = await Menu.find({}).sort({createdAt: -1});
        res.status(200).json(menus)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


//post new menu item
const postMenuItem = async(req, res) => {
    const newItem = req.body;
    try {
        const result = await Menu.create(newItem);
        res.status(200).json(result)
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//delete a menu item
const deleteMenuItem = async(req, res) => {
    const menuId = req.params.id;
    //console.log(menuId)
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(menuId)) {
        return res.status(400).json({ message: "Invalid Menu ID" });
    }
    try {
        const deletedItem = await Menu.findOneAndDelete(menuId);

        //console.log(deletedItem);

        if(!deletedItem){
            return res.status(404).json({ message:"Menu not found"})
        }
        res.status(200).json({message: "Menu Item deleted successfully!"})
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// get single menu item
const singleMenuItem = async (req, res) => {
    const menuId = req.params.id;
    try {
        const menu = await Menu.findById(menuId);
        res.status(200).json(menu)
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// update single menu item
const updateMenuItem = async (req, res) => {
    const menuId = req.params.id;
    const { name, recipe, image, category, price} = req.body;
    // console.log("Menu ID: ", menuId);
    // console.log("Request Body: ", req.body);
    if (!mongoose.Types.ObjectId.isValid(menuId)) {
        return res.status(400).json({ message: "Invalid Menu ID" });
    }
    

    try {
        const updatedMenu = await Menu.findOneAndUpdate(
            {_id:menuId}, 
            { name, recipe, image, category, price}, 
            {new: true, runValidators:true}
            );

        if(!updatedMenu) {
            return res.status(404).json({ message:"Menu not found"})
        }

        res.status(200).json(updatedMenu)
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getAllMenuItems,
    postMenuItem,
    deleteMenuItem,
    singleMenuItem,
    updateMenuItem
}