
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Get all categories
router.get('/allcategories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Internal Server Error');
  }
});

// Get a specific category by ID
router.get('/getcategory:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Internal Server Error');
  }
});

// Create a new category
router.post('/addcategory', async (req, res) => {
  try {
    const { content } = req.body;
    const category = new Category({ content });
    const savedCategory = await category.save();
    res.json(savedCategory);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Internal Server Error');
  }
});

// Update an existing category
router.put('/updatecategory:id', async (req, res) => {
  try {
    const { content } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { content },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Internal Server Error');
  }
});

// Delete a category
router.delete('/deletecategory:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
