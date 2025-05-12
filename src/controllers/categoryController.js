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
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { categoryName, categorySlug, description } = req.body;
    let imagePath = null;

    // Handle image upload
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    // Validate required fields
    if (!categoryName || !categorySlug) {
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
      success:true,
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
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  const { id } = req.params;
  const { categoryName, categorySlug, description } = req.body;

  try {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new CustomError('Category not found', 404);
    }

    let imagePath = category.image;

    // Handle image upload
    if (req.file) {
      // Delete old image if it exists
      if (category.image) {
        const oldImagePath = path.join(__dirname, '..', category.image);
        try {
          await fs.unlink(oldImagePath);
        } catch (err) {
          console.error('Failed to delete old image:', err);
        }
      }
      imagePath = `/uploads/${req.file.filename}`;
    }

    // Update fields only if provided
    const updatedFields = {
      categoryName: categoryName || category.categoryName,
      categorySlug: categorySlug || category.categorySlug,
      description: description !== undefined ? description : category.description,
      image: imagePath,
    };

    await category.update(updatedFields);

    res.json({
      message: 'Category updated successfully',
            success:true,
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
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  const { id } = req.params;

  try {
    const category = await Category.findByPk(id);
    if (!category) {
      throw new CustomError('Category not found', 404);
    }

    // Delete image if it exists
    if (category.image) {
      const imagePath = path.join(__dirname, '..', category.image);
      try {
        await fs.unlink(imagePath);
      } catch (err) {
        console.error('Failed to delete image:', err);
      }
    }

    await category.destroy();
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllCategory, getCategoryById, createCategory, updateCategory, deleteCategory };