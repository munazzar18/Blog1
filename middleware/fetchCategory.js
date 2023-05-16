const Category = require('../models/Category')

const fetchCategory = async (req, res, next) => {
    try {
      const category = await Category.findById(req.header('categoryId'))
    if(!category) {
    return res.status(400).json({ message: "Invalid category ID"})
    } 
      req.category = category;
      next();
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Internal Server Error');
    }
  };
  
  

module.exports = fetchCategory