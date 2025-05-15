const { Category } = require('../models');
const CustomError = require('../utils/errorHandler');
const fs = require('fs').promises;
const path = require('path');

const getAllCategory = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      attributes: ['categoryId', 'categoryName', 'categorySlug', 'description', 'image', 'createdAt', 'updatedAt'],
    });
    res.json(categories);
  } catch (error) {
    console.error('Get all categories error:', error);
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const category = await Category.findByPk(id, {
      attributes: ['categoryId', 'categoryName', 'categorySlug', 'description', 'image', 'createdAt', 'updatedAt'],
    });
    if (!category) {
      throw new CustomError('Category not found', 404);
    }
    res.json(category);
  } catch (error) {
    console.error('Get category by ID error:', error);
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  let imagePath = null;

  try {
    const { categoryName, categorySlug, description } = req.body;

    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    if (!categoryName || !categorySlug) {
      if (imagePath) {
        const filePath = path.join(__dirname, '..', imagePath);
        try {
          await fs.unlink(filePath);
        } catch (err) {
          console.error('Failed to delete uploaded file:', err);
        }
      }
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
      category: {
        categoryId: category.categoryId,
        categoryName: category.categoryName,
        categorySlug: category.categorySlug,
        description: category.description,
        image: category.image,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      },
    });
  } catch (error) {
    if (imagePath) {
      const filePath = path.join(__dirname, '..', imagePath);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error('Failed to delete uploaded file:', err);
      }
    }
    console.error('Create category error:', error);
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  const { id } = req.params;
  const { categoryName, categorySlug, description, clearImage } = req.body;
  let imagePath = null;
  let oldImagePath = null;

  try {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new CustomError('Category not found', 404);
    }

    // Handle image
    imagePath = category.image;
    if (clearImage === 'true') {
      oldImagePath = category.image;
      imagePath = null; // Clear the image
    } else if (req.file) {
      oldImagePath = category.image;
      imagePath = `/uploads/${req.file.filename}`;
    }

    const updatedFields = {
      categoryName: categoryName || category.categoryName,
      categorySlug: categorySlug || category.categorySlug,
      description: description !== undefined ? description : category.description,
      image: imagePath,
    };

    await category.update(updatedFields);

    // Delete old image if it was cleared or replaced
    if (oldImagePath) {
      const filePath = path.join(__dirname, '..', oldImagePath);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error('Failed to delete old image:', err);
      }
    }

    res.json({
      message: 'Category updated successfully',
      success: true,
      category: {
        categoryId: category.categoryId,
        categoryName: category.categoryName,
        categorySlug: category.categorySlug,
        description: category.description,
        image: category.image,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      },
    });
  } catch (error) {
    // Clean up new uploaded file if update fails
    if (req.file && imagePath !== category?.image) {
      const filePath = path.join(__dirname, '..', imagePath);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error('Failed to delete uploaded file:', err);
      }
    }
    console.error('Update category error:', error);
    next(error);
  }
};
const deleteCategory = async (req, res, next) => {
  const { id } = req.params;

  try {
    const category = await Category.findByPk(id);
    console.log('Category instance:', category); // Debug
    console.log('Category destroy method:', typeof category?.destroy); // Debug
    if (!category) {
      throw new CustomError('Category not found', 404);
    }

    if (category.image) {
      const imagePath = path.join(__dirname, '..', category.image);
      try {
        await fs.unlink(imagePath);
      } catch (err) {
        console.error('Failed to delete image:', err);
      }
    }

    await Category.destroy({ where: { categoryId: id } }); 
    console.log('Category deleted:', id); 
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    next(error);
  }
};

module.exports = { getAllCategory, getCategoryById, createCategory, updateCategory, deleteCategory };