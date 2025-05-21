const { Category } = require('../models');
const CustomError = require('../utils/errorHandler');
const fs = require('fs').promises;
const path = require('path');

// Helper to safely delete a file
const deleteFileIfExists = async (relativePath) => {
  if (!relativePath) return;
  const fullPath = path.join(__dirname, '..', relativePath);
  try {
    await fs.unlink(fullPath);
  } catch (err) {
    console.error('Failed to delete file:', fullPath, err.message);
  }
};

const getAllCategory = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      attributes: ['categoryId', 'categoryName', 'categorySlug', 'description', 'image', 'createdAt', 'updatedAt'],
    });
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id, {
      attributes: ['categoryId', 'categoryName', 'categorySlug', 'description', 'image', 'createdAt', 'updatedAt'],
    });
    if (!category) throw new CustomError('Category not found', 404);
    res.json(category);
  } catch (err) {
    next(err);
  }
};

const createCategory = async (req, res, next) => {
  const { categoryName, categorySlug, description } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    if (!categoryName || !categorySlug) {
      await deleteFileIfExists(imagePath);
      throw new CustomError('Category name and slug are required', 400);
    }

    const category = await Category.create({
      categoryName,
      categorySlug,
      description,
      image: imagePath,
    });

    res.status(201).json({
      message: 'Category created successfully',
      success: true,
      category,
    });
  } catch (err) {
    await deleteFileIfExists(imagePath);
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  const { id } = req.params;
  const { categoryName, categorySlug, description, clearImage } = req.body;
  const newImagePath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const category = await Category.findByPk(id);
    if (!category) throw new CustomError('Category not found', 404);

    const oldImagePath = category.image;

    const updatedFields = {
      categoryName: categoryName || category.categoryName,
      categorySlug: categorySlug || category.categorySlug,
      description: description !== undefined ? description : category.description,
      image:
        clearImage === 'true' ? null :
        newImagePath ? newImagePath :
        category.image,
    };

    await category.update(updatedFields);

    // Remove old image if replaced or cleared
    if (clearImage === 'true' || newImagePath) {
      await deleteFileIfExists(oldImagePath);
    }

    res.json({
      message: 'Category updated successfully',
      success: true,
      category,
    });
  } catch (err) {
    // If update failed, delete uploaded image if it wasn't saved
    if (newImagePath) await deleteFileIfExists(newImagePath);
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) throw new CustomError('Category not found', 404);

    await deleteFileIfExists(category.image);
    await category.destroy();

    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { deleteCategory, updateCategory, createCategory,getCategoryById,getAllCategory,deleteFileIfExists };