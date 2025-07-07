const { Category,Type } = require('../models');
const CustomError = require('../utils/errorHandler');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
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
      attributes: ['categoryId', 'categoryName', 'categorySlug', 'description', 'image', 'typeId', 'createdAt', 'updatedAt'],
      include: [{ model: Type, as: 'type', attributes: ['typeName'] }],
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
      attributes: ['categoryId', 'categoryName', 'categorySlug', 'description', 'image', 'typeId', 'createdAt', 'updatedAt'],
      include: [{ model: Type, as: 'type', attributes: ['typeName'] }],
    });
    if (!category) throw new CustomError('Category not found', 404);
    res.json(category);
  } catch (err) {
    next(err);
  }
};

const createCategory = async (req, res, next) => {
  console.log(" the requested data is ",JSON.stringify(req.body));
  
  const { categoryName, categorySlug, description, typeId } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    if (!categoryName || !categorySlug || !typeId) {
      await deleteFileIfExists(imagePath);
      throw new CustomError('Category name, slug, and type are required', 400);
    }

    const type = await Type.findByPk(typeId);
    if (!type) {
      await deleteFileIfExists(imagePath);
      throw new CustomError('Invalid type selected', 400);
    }

    const category = await Category.create({
      categoryId: uuidv4(),
      categoryName,
      categorySlug,
      description,
      image: imagePath,
      typeId,
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
  const { categoryName, categorySlug, description, typeId, clearImage } = req.body;
  const newImagePath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const category = await Category.findByPk(id);
    if (!category) throw new CustomError('Category not found', 404);

    if (typeId) {
      const type = await Type.findByPk(typeId);
      if (!type) throw new CustomError('Invalid type selected', 400);
    }

    const oldImagePath = category.image;

    const updatedFields = {
      categoryName: categoryName || category.categoryName,
      categorySlug: categorySlug || category.categorySlug,
      description: description !== undefined ? description : category.description,
      typeId: typeId || category.typeId,
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