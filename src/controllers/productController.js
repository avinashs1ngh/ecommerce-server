const { Product, Category, SubCategory } = require('../models');
const CustomError = require('../utils/errorHandler');
const fs = require('fs').promises;
const path = require('path');

const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category, as: 'category', attributes: ['categoryId', 'categoryName'] },
        { model: SubCategory, as: 'subCategory', attributes: ['subCategoryId', 'subCategoryName'] },
      ],
    });
    res.json(products);
  } catch (error) {
    console.error('Get all products error:', error);
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id, {
      include: [
        { model: Category, as: 'category', attributes: ['categoryId', 'categoryName'] },
        { model: SubCategory, as: 'subCategory', attributes: ['subCategoryId', 'subCategoryName'] },
      ],
    });
    if (!product) {
      throw new CustomError('Product not found', 404);
    }
    res.json(product);
  } catch (error) {
    console.error('Get product by ID error:', error);
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  let mainImagePath = null;
  let subImagePaths = [];

  try {
    const {
      categoryId,
      subCategoryId,
      productName,
      availableStatus,
      mrp,
      salePrice,
      description,
      brand,
      variations,
      variationStock,
    } = req.body;

    // Validate required fields
    if (!categoryId || !subCategoryId || !productName || !availableStatus || !mrp || !salePrice || !req.files?.mainImage) {
      throw new CustomError('All required fields must be provided, including the main image', 400);
    }

    // Validate category and subcategory exist
    const category = await Category.findByPk(categoryId);
    if (!category) {
      throw new CustomError('Category not found', 404);
    }
    const subCategory = await SubCategory.findByPk(subCategoryId);
    if (!subCategory) {
      throw new CustomError('Subcategory not found', 404);
    }

    // Parse JSON fields
    const parsedVariations = variations ? JSON.parse(variations) : [];
    const parsedVariationStock = variationStock ? JSON.parse(variationStock) : {};

    // Handle main image upload
    const mainImage = req.files.mainImage[0];
    mainImagePath = `/uploads/${mainImage.filename}`;

    // Handle sub images upload
    if (req.files.subImages) {
      subImagePaths = req.files.subImages.map(file => `/uploads/${file.filename}`);
    }

    const product = await Product.create({
      categoryId,
      subCategoryId,
      productName,
      mainImage: mainImagePath,
      subImages: subImagePaths,
      availableStatus,
      mrp,
      salePrice,
      description,
      brand,
      variations: parsedVariations,
      variationStock: parsedVariationStock,
    });

    res.status(201).json({
      message: 'Product created successfully',
      success: true,
      product,
    });
  } catch (error) {
    // Clean up uploaded files if creation fails
    if (mainImagePath) {
      const filePath = path.join(__dirname, '..', mainImagePath);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error('Failed to delete main image:', err);
      }
    }
    if (subImagePaths.length > 0) {
      for (const subImagePath of subImagePaths) {
        const filePath = path.join(__dirname, '..', subImagePath);
        try {
          await fs.unlink(filePath);
        } catch (err) {
          console.error('Failed to delete sub image:', err);
        }
      }
    }
    console.error('Create product error:', error);
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  let mainImagePath = null;
  let subImagePaths = [];
  let oldMainImagePath = null;
  let oldSubImagePaths = [];

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new CustomError('Product not found', 404);
    }

    const {
      categoryId,
      subCategoryId,
      productName,
      availableStatus,
      mrp,
      salePrice,
      description,
      brand,
      variations,
      variationStock,
      clearMainImage,
      clearSubImages,
      existingSubImages,
    } = req.body;

    // Validate category and subcategory if provided
    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        throw new CustomError('Category not found', 404);
      }
    }
    if (subCategoryId) {
      const subCategory = await SubCategory.findByPk(subCategoryId);
      if (!subCategory) {
        throw new CustomError('Subcategory not found', 404);
      }
    }

    // Parse JSON fields
    const parsedVariations = variations ? JSON.parse(variations) : product.variations;
    const parsedVariationStock = variationStock ? JSON.parse(variationStock) : product.variationStock;
    const parsedExistingSubImages = existingSubImages ? JSON.parse(existingSubImages) : [];

    // Parse subImages from product (handle JSON string or null/undefined)
    let currentSubImages = [];
    if (product.subImages) {
      try {
        currentSubImages = typeof product.subImages === 'string'
          ? JSON.parse(product.subImages)
          : product.subImages;
        // Ensure currentSubImages is an array
        if (!Array.isArray(currentSubImages)) {
          currentSubImages = [];
        }
      } catch (err) {
        console.error('Failed to parse product.subImages:', err);
        currentSubImages = [];
      }
    }

    // Handle main image
    mainImagePath = product.mainImage;
    if (clearMainImage === 'true') {
      oldMainImagePath = product.mainImage;
      mainImagePath = null; // Clear the main image
    } else if (req.files?.mainImage) {
      oldMainImagePath = product.mainImage;
      mainImagePath = `/uploads/${req.files.mainImage[0].filename}`;
    }

    // Handle sub images
    subImagePaths = currentSubImages;
    if (clearSubImages === 'true') {
      oldSubImagePaths = currentSubImages;
      subImagePaths = []; // Clear all sub-images
    } else {
      // Start with existing sub-images sent from frontend
      subImagePaths = parsedExistingSubImages;
      // Add new uploaded sub-images
      if (req.files?.subImages) {
        const newSubImagePaths = req.files.subImages.map(file => `/uploads/${file.filename}`);
        subImagePaths = [...subImagePaths, ...newSubImagePaths];
      }
      // Store old sub-images for cleanup (images no longer in parsedExistingSubImages)
      oldSubImagePaths = currentSubImages.filter(
        path => !parsedExistingSubImages.includes(path)
      );
    }

    const updatedFields = {
      categoryId: categoryId || product.categoryId,
      subCategoryId: subCategoryId || product.subCategoryId,
      productName: productName || product.productName,
      mainImage: mainImagePath,
      subImages: subImagePaths,
      availableStatus: availableStatus || product.availableStatus,
      mrp: mrp || product.mrp,
      salePrice: salePrice || product.salePrice,
      description: description !== undefined ? description : product.description,
      brand: brand !== undefined ? brand : product.brand,
      variations: parsedVariations,
      variationStock: parsedVariationStock,
    };

    await product.update(updatedFields);

    // Delete old images if they were cleared or replaced
    if (oldMainImagePath) {
      const filePath = path.join(__dirname, '..', oldMainImagePath);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error('Failed to delete old main image:', err);
      }
    }
    if (oldSubImagePaths.length > 0) {
      for (const subImagePath of oldSubImagePaths) {
        const filePath = path.join(__dirname, '..', subImagePath);
        try {
          await fs.unlink(filePath);
        } catch (err) {
          console.error('Failed to delete old sub image:', err);
        }
      }
    }

    res.json({
      message: 'Product updated successfully',
      success: true,
      product,
    });
  } catch (error) {
    // Clean up new uploaded files if update fails
    if (req.files?.mainImage && mainImagePath !== product?.mainImage) {
      const filePath = path.join(__dirname, '..', mainImagePath);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error('Failed to delete new main image:', err);
      }
    }
    if (req.files?.subImages && subImagePaths.length > 0) {
      for (const subImagePath of subImagePaths) {
        const filePath = path.join(__dirname, '..', subImagePath);
        try {
          await fs.unlink(filePath);
        } catch (err) {
          console.error('Failed to delete new sub image:', err);
        }
      }
    }
    console.error('Update product error:', error);
    next(error);
  }
};


const deleteProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new CustomError('Product not found', 404);
    }

    // Delete main image
    if (product.mainImage) {
      const filePath = path.join(__dirname, '..', product.mainImage);
      try {
        await fs.unlink(filePath);
      } catch (err) {
        console.error('Failed to delete main image:', err);
      }
    }

    // Delete sub images
    if (product.subImages && product.subImages.length > 0) {
      for (const subImagePath of product.subImages) {
        const filePath = path.join(__dirname, '..', subImagePath);
        try {
          await fs.unlink(filePath);
        } catch (err) {
          console.error('Failed to delete sub image:', err);
        }
      }
    }

    await Product.destroy({ where: { productId: id } });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    next(error);
  }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };