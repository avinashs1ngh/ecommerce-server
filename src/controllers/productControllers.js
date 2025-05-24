const { Category, SubCategory, Product, Variant } = require('../models');
const { v4: uuidv4 } = require('uuid');

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category, as: 'categories', attributes: ['categoryId', 'categoryName'], through: { attributes: [] } },
        { model: SubCategory, as: 'subCategories', attributes: ['subCategoryId', 'subCategoryName'], through: { attributes: [] } },
        { model: Variant, as: 'variants', attributes: ['variantId', 'sku', 'stock', 'price', 'image', 'options'] },
      ],
      order: [['updatedAt', 'DESC']] 
    });

    const parsedProducts = products.map(product => ({
      ...product.get({ plain: true }),
      subImages: typeof product.subImages === 'string' ? JSON.parse(product.subImages) : product.subImages || [],
      variants: product.variants.map(variant => ({
        ...variant,
        options: typeof variant.options === 'string' ? JSON.parse(variant.options) : variant.options || [],
      })),
    }));

    res.status(200).json({ success: true, data: parsedProducts });
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: [
        { model: Category, as: 'categories', attributes: ['categoryId', 'categoryName'], through: { attributes: [] } },
        { model: SubCategory, as: 'subCategories', attributes: ['subCategoryId', 'subCategoryName'], through: { attributes: [] } },
        { model: Variant, as: 'variants', attributes: ['variantId', 'sku', 'stock', 'price', 'image', 'options'] },
      ],
    });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const parsedProduct = {
      ...product.get({ plain: true }),
      subImages: typeof product.subImages === 'string' ? JSON.parse(product.subImages) : product.subImages || [],
      variants: product.variants.map(variant => ({
        ...variant,
        options: typeof variant.options === 'string' ? JSON.parse(variant.options) : variant.options || [],
      })),
    };

    res.status(200).json({ success: true, data: parsedProduct });
  } catch (error) {
    console.error('Error in getProductById:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      categoryIds,
      subCategoryIds,
      productName,
      availableStatus,
      mrp,
      salePrice,
      description,
      brand,
      variants,
      existingSubImages = '[]',
      clearMainImage,
      clearSubImages,
    } = req.body;

    console.log('req.files:', req.files);
    console.log('Variants (raw):', variants);

    const mainImageFile = req.files?.mainImage?.[0];
    const subImageFiles = req.files?.subImages || [];
    const variantImageFiles = req.files?.variantImages || [];
    const parsedVariants = JSON.parse(variants || '[]');
    const parsedCategoryIds = JSON.parse(categoryIds || '[]');
    const parsedSubCategoryIds = JSON.parse(subCategoryIds || '[]');
    const parsedExistingSubImages = JSON.parse(existingSubImages);

    console.log('Parsed Variants:', parsedVariants);
    console.log('Parsed CategoryIds:', parsedCategoryIds);
    console.log('Parsed SubCategoryIds:', parsedSubCategoryIds);

    if (!parsedCategoryIds.length || !parsedSubCategoryIds.length || !productName || !availableStatus || !mrp || !salePrice) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided.' });
    }

    if (!mainImageFile) {
      return res.status(400).json({ success: false, message: 'Main image is required.' });
    }

    const mainImagePath = `/uploads/${mainImageFile.filename}`;
    const subImagePaths = [...parsedExistingSubImages];
    for (const file of subImageFiles) {
      subImagePaths.push(`/uploads/${file.filename}`);
    }

    const product = await Product.create({
      productId: uuidv4(),
      productName,
      mainImage: mainImagePath,
      subImages: clearSubImages === 'true' ? [] : subImagePaths,
      availableStatus,
      mrp: parseFloat(mrp),
      salePrice: parseFloat(salePrice),
      description,
      brand,
    });

    // Associate categories and subcategories
    await product.setCategories(parsedCategoryIds);
    await product.setSubCategories(parsedSubCategoryIds);

    const variantImageMap = {};
    variantImageFiles.forEach((file) => {
      variantImageMap[file.originalname] = `/uploads/${file.filename}`;
    });

    console.log('Variant Image Files:', variantImageFiles);
    console.log('Variant Image Map:', variantImageMap);

    for (const variant of parsedVariants) {
      const variantImagePath = variant.imageIdentifier && variantImageMap[variant.imageIdentifier]
        ? variantImageMap[variant.imageIdentifier]
        : variant.image || null;
      console.log('Saving variant:', {
        sku: variant.sku,
        image: variantImagePath,
      });
      await Variant.create({
        variantId: uuidv4(),
        productId: product.productId,
        sku: variant.sku,
        stock: variant.stock,
        price: parseFloat(variant.price),
        image: variantImagePath,
        options: JSON.stringify(variant.options),
      });
    }

    const parsedProduct = {
      ...product.get({ plain: true }),
      categories: parsedCategoryIds.map(id => ({ categoryId: id })),
      subCategories: parsedSubCategoryIds.map(id => ({ subCategoryId: id })),
      subImages: product.subImages || [],
      variants: parsedVariants,
    };

    res.status(201).json({ success: true, data: parsedProduct });
  } catch (error) {
    console.error('Error in createProduct:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      categoryIds,
      subCategoryIds,
      productName,
      availableStatus,
      mrp,
      salePrice,
      description,
      brand,
      variants,
      existingSubImages = '[]',
      clearMainImage,
      clearSubImages,
    } = req.body;

    console.log('req.files:', req.files);
    console.log('Variants (raw):', variants);

    const mainImageFile = req.files?.mainImage?.[0];
    const subImageFiles = req.files?.subImages || [];
    const variantImageFiles = req.files?.variantImages || [];
    const parsedVariants = JSON.parse(variants || '[]');
    const parsedCategoryIds = JSON.parse(categoryIds || '[]');
    const parsedSubCategoryIds = JSON.parse(subCategoryIds || '[]');
    const parsedExistingSubImages = JSON.parse(existingSubImages);

    console.log('Parsed Variants:', parsedVariants);
    console.log('Parsed CategoryIds:', parsedCategoryIds);
    console.log('Parsed SubCategoryIds:', parsedSubCategoryIds);

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let mainImagePath = product.mainImage;
    if (clearMainImage === 'true') {
      mainImagePath = null;
    } else if (mainImageFile) {
      mainImagePath = `/uploads/${mainImageFile.filename}`;
    }

    const subImagePaths = clearSubImages === 'true' ? [] : [...parsedExistingSubImages];
    for (const file of subImageFiles) {
      subImagePaths.push(`/uploads/${file.filename}`);
    }

    await product.update({
      productName,
      mainImage: mainImagePath,
      subImages: subImagePaths,
      availableStatus,
      mrp: parseFloat(mrp),
      salePrice: parseFloat(salePrice),
      description,
      brand,
    });

    // Update associations
    await product.setCategories(parsedCategoryIds);
    await product.setSubCategories(parsedSubCategoryIds);

    await Variant.destroy({ where: { productId: id } });

    const variantImageMap = {};
    variantImageFiles.forEach((file) => {
      variantImageMap[file.originalname] = `/uploads/${file.filename}`;
    });

    console.log('Variant Image Files:', variantImageFiles);
    console.log('Variant Image Map:', variantImageMap);

    for (const variant of parsedVariants) {
      const variantImagePath = variant.imageIdentifier && variantImageMap[variant.imageIdentifier]
        ? variantImageMap[variant.imageIdentifier]
        : variant.image || null;
      console.log('Saving variant:', {
        sku: variant.sku,
        image: variantImagePath,
      });
      await Variant.create({
        variantId: uuidv4(),
        productId: product.productId,
        sku: variant.sku,
        stock: variant.stock,
        price: parseFloat(variant.price),
        image: variantImagePath,
        options: JSON.stringify(variant.options),
      });
    }

    const parsedProduct = {
      ...product.get({ plain: true }),
      categories: parsedCategoryIds.map(id => ({ categoryId: id })),
      subCategories: parsedSubCategoryIds.map(id => ({ subCategoryId: id })),
      subImages: product.subImages || [],
      variants: parsedVariants,
    };

    res.status(200).json({ success: true, data: parsedProduct });
  } catch (error) {
    console.error('Error in updateProduct:', error);
    res.status(500).json({ success: false, message: error.message });
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
    console.error('Error in deleteProduct:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};