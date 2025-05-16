// src/controllers/productControllers.js
const { Attribute,Category,SubCategory, Option, OptionImage, Product, Variant,VariantImage, VariantOption, sequelize } = require('../models');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category, as: 'category', attributes: ['categoryId', 'categoryName'] },
        { model: SubCategory, as: 'subCategory', attributes: ['subCategoryId', 'subCategoryName'] },
      ],
    });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createProduct = async (req, res) => {
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
      attributes,
      variants,
      existingSubImages,
      clearMainImage,
      clearSubImages,
    } = req.body;

    // Validate required fields
    if (!categoryId || !subCategoryId || !productName || !availableStatus || !mrp || !salePrice) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided' });
    }

    // Access files from req.files object
    const mainImageFile = req.files?.mainImage?.[0]; // Single file
    const subImageFiles = req.files?.subImages || []; // Array of files
    const variantImageFiles = req.files?.variantImages || []; // Array of files

    const mainImage = mainImageFile ? `/uploads/${mainImageFile.filename}` : null;
    const subImages = subImageFiles.map(file => `/uploads/${file.filename}`);
    const variantImages = variantImageFiles;

    // Validate main image for new products
    if (!mainImage && clearMainImage !== 'true') {
      return res.status(400).json({ success: false, message: 'Main image is required for creating a product' });
    }

    const parsedAttributes = JSON.parse(attributes || '[]');
    const parsedVariants = JSON.parse(variants || '[]');

    // Validate variants
    if (parsedVariants.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one variant is required' });
    }

    const productData = {
      productId: uuidv4(),
      categoryId,
      subCategoryId,
      productName,
      availableStatus,
      mrp: parseFloat(mrp),
      salePrice: parseFloat(salePrice),
      description,
      brand,
      mainImage,
      subImages: clearSubImages === 'true' ? [] : [...(JSON.parse(existingSubImages || '[]')), ...subImages],
    };

    const product = await Product.create(productData);

    // Handle variants and variant images
    let imageIndex = 0;
    for (const variant of parsedVariants) {
      const variantData = {
        variantId: variant.variantId,
        productId: product.productId,
        sku: variant.sku,
        stock: parseInt(variant.stock),
        price: parseFloat(variant.price),
      };

      // Validate variant data
      if (!variant.sku || !variant.stock || !variant.price) {
        await Product.destroy({ where: { productId: product.productId } }); // Rollback on error
        return res.status(400).json({ success: false, message: 'Each variant must have SKU, stock, and price' });
      }

      await Variant.create(variantData);

      for (const option of variant.options) {
        await VariantOption.create({
          variantId: variant.variantId,
          optionId: option.optionId,
        });
      }

      // Assign image to variant if it has one
      if (variant.hasImage && imageIndex < variantImages.length) {
        const variantImage = variantImages[imageIndex];
        await VariantImage.create({
          imageId: uuidv4(),
          variantId: variant.variantId,
          imageUrl: `/uploads/${variantImage.filename}`,
        });
        imageIndex++;
      }
    }

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: error.message, stack: error.stack });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      categoryId,
      subCategoryId,
      productName,
      availableStatus,
      mrp,
      salePrice,
      description,
      brand,
      attributes,
      variants,
      existingSubImages,
      clearMainImage,
      clearSubImages,
    } = req.body;

    // Validate required fields
    if (!categoryId || !subCategoryId || !productName || !availableStatus || !mrp || !salePrice) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided' });
    }

    // Access files from req.files object
    const mainImageFile = req.files?.mainImage?.[0]; // Single file
    const subImageFiles = req.files?.subImages || []; // Array of files
    const variantImageFiles = req.files?.variantImages || []; // Array of files

    const mainImage = mainImageFile ? `/uploads/${mainImageFile.filename}` : null;
    const subImages = subImageFiles.map(file => `/uploads/${file.filename}`);
    const variantImages = variantImageFiles;

    const parsedAttributes = JSON.parse(attributes || '[]');
    const parsedVariants = JSON.parse(variants || '[]');

    // Validate variants
    if (parsedVariants.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one variant is required' });
    }

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.update({
      categoryId,
      subCategoryId,
      productName,
      availableStatus,
      mrp: parseFloat(mrp),
      salePrice: parseFloat(salePrice),
      description,
      brand,
      mainImage: clearMainImage === 'true' ? null : mainImage || product.mainImage,
      subImages: clearSubImages === 'true' ? [] : [...(JSON.parse(existingSubImages || '[]')), ...subImages],
    });

    // Clear existing variants and images
    await Variant.destroy({ where: { productId: id } });
    await VariantImage.destroy({ where: { variantId: parsedVariants.map(v => v.variantId) } });

    // Handle variants and variant images
    let imageIndex = 0;
    for (const variant of parsedVariants) {
      const variantData = {
        variantId: variant.variantId,
        productId: id,
        sku: variant.sku,
        stock: parseInt(variant.stock),
        price: parseFloat(variant.price),
      };

      // Validate variant data
      if (!variant.sku || !variant.stock || !variant.price) {
        return res.status(400).json({ success: false, message: 'Each variant must have SKU, stock, and price' });
      }

      await Variant.create(variantData);

      for (const option of variant.options) {
        await VariantOption.create({
          variantId: variant.variantId,
          optionId: option.optionId,
        });
      }

      // Assign image to variant if it has one
      if (variant.hasImage && imageIndex < variantImages.length) {
        const variantImage = variantImages[imageIndex];
        await VariantImage.create({
          imageId: uuidv4(),
          variantId: variant.variantId,
          imageUrl: `/uploads/${variantImage.filename}`,
        });
        imageIndex++;
      }
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: error.message, stack: error.stack });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    await product.destroy();
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAttributes = async (req, res) => {
  try {
    const attributes = await Attribute.findAll();
    console.log('Fetched attributes:', attributes);
    res.status(200).json({ success: true, data: attributes || [] });
  } catch (error) {
    console.error('Get attributes error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch attributes' });
  }
};

const createAttribute = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Attribute name is required and must be a non-empty string' });
    }
    const attribute = await Attribute.create({
      attributeId: uuidv4(),
      name: name.trim(),
    });
    res.status(201).json({ success: true, data: attribute });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message).join(', ');
      res.status(400).json({ success: false, message: `Validation error: ${messages}` });
    } else if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ success: false, message: 'Attribute name already exists' });
    } else {
      res.status(500).json({ success: false, message: error.message || 'Failed to create attribute' });
    }
  }
};

const updateAttribute = async (req, res) => {
  try {
    const { attributeId } = req.params;
    const { name } = req.body;

    const attribute = await Attribute.findByPk(attributeId);
    if (!attribute) {
      return res.status(404).json({ success: false, message: 'Attribute not found' });
    }

    attribute.name = name || attribute.name;
    await attribute.save();

    res.status(200).json({ success: true, data: attribute });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteAttribute = async (req, res) => {
  try {
    const { attributeId } = req.params;

    const attribute = await Attribute.findByPk(attributeId);
    if (!attribute) {
      return res.status(404).json({ success: false, message: 'Attribute not found' });
    }

    await attribute.destroy();
    res.status(200).json({ success: true, message: 'Attribute deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOptions = async (req, res) => {
  try {
    const { attributeId } = req.params;
    const options = await Option.findAll({
      where: { attributeId },
      include: [{ model: OptionImage, as: 'images' }],
    });
    res.status(200).json({ success: true, data: options });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const createOption = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { attributeId } = req.params;
    const { value } = req.body;
    const optionImages = req.files || []; // Use req.files directly

    console.log('createOption - Received body:', req.body);
    console.log('createOption - Received files:', req.files);

    if (!value) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'Option value is required' });
    }

    const option = await Option.create(
      {
        optionId: uuidv4(),
        attributeId,
        value,
      },
      { transaction }
    );

    console.log('Created option:', option.toJSON());

    if (optionImages.length > 0) {
      const imageUrls = optionImages.map((file) => `/uploads/${file.filename}`);
      const imageRecords = imageUrls.map((imageUrl) => ({
        imageId: uuidv4(),
        optionId: option.optionId,
        imageUrl,
      }));
      console.log('Image records to create:', imageRecords);
      try {
        await OptionImage.bulkCreate(imageRecords, { transaction });
        console.log('OptionImage records created successfully');
      } catch (bulkCreateError) {
        console.error('OptionImage bulkCreate error:', bulkCreateError);
        throw bulkCreateError;
      }
    } else {
      console.log('No optionImages to process');
    }

    const createdOption = await Option.findByPk(
      option.optionId,
      {
        include: [{ model: OptionImage, as: 'images' }],
        transaction,
      }
    );

    console.log('Fetched createdOption:', createdOption?.toJSON());

    await transaction.commit();
    res.status(201).json({ success: true, data: createdOption });
  } catch (error) {
    await transaction.rollback();
    console.error('createOption error:', error);
    if (error.name === 'MulterError') {
      res.status(400).json({ success: false, message: `File upload error: ${error.message}` });
    } else if (error.name === 'SequelizeValidationError') {
      res.status(400).json({ success: false, message: `Validation error: ${error.message}` });
    } else {
      res.status(500).json({ success: false, message: error.message || 'Failed to create option' });
    }
  }
};

const updateOption = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { attributeId, optionId } = req.params;
    const { value } = req.body;
    const optionImages = req.files || []; // Use req.files directly

    console.log('updateOption - Received body:', req.body);
    console.log('updateOption - Received files:', req.files);

    const option = await Option.findOne({ where: { optionId, attributeId }, transaction });
    if (!option) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Option not found' });
    }

    option.value = value || option.value;
    await option.save({ transaction });

    if (optionImages.length > 0) {
      await OptionImage.destroy({ where: { optionId }, transaction });
      const imageUrls = optionImages.map((file) => `/uploads/${file.filename}`);
      const imageRecords = imageUrls.map((imageUrl) => ({
        imageId: uuidv4(),
        optionId,
        imageUrl,
      }));
      console.log('Image records to create:', imageRecords);
      await OptionImage.bulkCreate(imageRecords, { transaction });
      console.log('OptionImage records created successfully');
    } else {
      console.log('No optionImages to process');
    }

    const updatedOption = await Option.findByPk(
      optionId,
      {
        include: [{ model: OptionImage, as: 'images' }],
        transaction,
      }
    );

    console.log('Fetched updatedOption:', updatedOption?.toJSON());

    await transaction.commit();
    res.status(200).json({ success: true, data: updatedOption });
  } catch (error) {
    await transaction.rollback();
    console.error('updateOption error:', error);
    if (error.name === 'MulterError') {
      res.status(400).json({ success: false, message: `File upload error: ${error.message}` });
    } else if (error.name === 'SequelizeValidationError') {
      res.status(400).json({ success: false, message: `Validation error: ${error.message}` });
    } else {
      res.status(500).json({ success: false, message: error.message || 'Failed to create option' });
    }
  }
};

const deleteOption = async (req, res) => {
  try {
    const { attributeId, optionId } = req.params;

    const option = await Option.findOne({ where: { optionId, attributeId } });
    if (!option) {
      return res.status(404).json({ success: false, message: 'Option not found' });
    }

    await option.destroy();
    res.status(200).json({ success: true, message: 'Option deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAttributes,
  createAttribute,
  updateAttribute,
  deleteAttribute,
  getOptions,
  createOption,
  updateOption,
  deleteOption,
};