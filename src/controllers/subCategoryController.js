const { SubCategory, Category } = require('../models');
const CustomError = require('../utils/errorHandler');

const getAllSubCategories = async (req, res, next) => {
  try {
    const subCategories = await SubCategory.findAll({
      attributes: ['subCategoryId', 'subCategoryName', 'subCategorySlug', 'description', 'parentCategoryId', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Category,
          as: 'parentCategory',
          attributes: ['categoryId', 'categoryName'],
        },
      ],
    });
    res.json(subCategories);
  } catch (error) {
    console.error('Get all subcategories error:', error);
    next(error);
  }
};

const getSubCategoryById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const subCategory = await SubCategory.findByPk(id, {
      attributes: ['subCategoryId', 'subCategoryName', 'subCategorySlug', 'description', 'parentCategoryId', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Category,
          as: 'parentCategory',
          attributes: ['categoryId', 'categoryName'],
        },
      ],
    });
    if (!subCategory) {
      throw new CustomError('Subcategory not found', 404);
    }
    res.json(subCategory);
  } catch (error) {
    console.error('Get subcategory by ID error:', error);
    next(error);
  }
};

const createSubCategory = async (req, res, next) => {
  try {
    const { subCategoryName, subCategorySlug, description, parentCategoryId } = req.body;

    if (!subCategoryName || !subCategorySlug || !parentCategoryId) {
      throw new CustomError('Subcategory name, slug, and parent category are required', 400);
    }

    const parentCategory = await Category.findByPk(parentCategoryId);
    if (!parentCategory) {
      throw new CustomError('Parent category not found', 404);
    }

    const subCategory = await SubCategory.create({
      subCategoryName,
      subCategorySlug,
      description,
      parentCategoryId,
    });

    res.status(201).json({
      message: 'Subcategory created successfully',
      success: true,
      subCategory: {
        subCategoryId: subCategory.subCategoryId,
        subCategoryName: subCategory.subCategoryName,
        subCategorySlug: subCategory.subCategorySlug,
        description: subCategory.description,
        parentCategoryId: subCategory.parentCategoryId,
        createdAt: subCategory.createdAt,
        updatedAt: subCategory.updatedAt,
      },
    });
  } catch (error) {
    console.error('Create subcategory error:', error);
    next(error);
  }
};

const updateSubCategory = async (req, res, next) => {
  const { id } = req.params;
  const { subCategoryName, subCategorySlug, description, parentCategoryId } = req.body;

  try {
    const subCategory = await SubCategory.findByPk(id);
    if (!subCategory) {
      throw new CustomError('Subcategory not found', 404);
    }

    if (parentCategoryId) {
      const parentCategory = await Category.findByPk(parentCategoryId);
      if (!parentCategory) {
        throw new CustomError('Parent category not found', 404);
      }
    }

    const updatedFields = {
      subCategoryName: subCategoryName || subCategory.subCategoryName,
      subCategorySlug: subCategorySlug || subCategory.subCategorySlug,
      description: description !== undefined ? description : subCategory.description,
      parentCategoryId: parentCategoryId || subCategory.parentCategoryId,
    };

    await subCategory.update(updatedFields);

    res.json({
      message: 'Subcategory updated successfully',
      success: true,
      subCategory: {
        subCategoryId: subCategory.subCategoryId,
        subCategoryName: subCategory.subCategoryName,
        subCategorySlug: subCategory.subCategorySlug,
        description: subCategory.description,
        parentCategoryId: subCategory.parentCategoryId,
        createdAt: subCategory.createdAt,
        updatedAt: subCategory.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update subcategory error:', error);
    next(error);
  }
};

const deleteSubCategory = async (req, res, next) => {
  const { id } = req.params;

  try {
    const subCategory = await SubCategory.findByPk(id);
    if (!subCategory) {
      throw new CustomError('Subcategory not found', 404);
    }

    await SubCategory.destroy({ where: { subCategoryId: id } });

    res.json({ message: 'Subcategory deleted successfully' });
  } catch (error) {
    console.error('Delete subcategory error:', error);
    next(error);
  }
};

module.exports = { getAllSubCategories, getSubCategoryById, createSubCategory, updateSubCategory, deleteSubCategory };