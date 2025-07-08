const { Category, SubCategory, Product, Variant,Type } = require('../models');
const { v4: uuidv4 } = require('uuid');



const getAllProductsPublic = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category, as: 'categories', attributes: ['categoryId', 'categoryName'], through: { attributes: [] } },
        { model: SubCategory, as: 'subCategories', attributes: ['subCategoryId', 'subCategoryName'], through: { attributes: [] } },
        { model: Variant, as: 'variants', attributes: ['variantId', 'sku', 'stock', 'price', 'image', 'options'] },
      ],
      order: [['updatedAt', 'DESC']]
    });

    const parsedProducts = products.map(product => {
      const subImages = typeof product.subImages === 'string' ? JSON.parse(product.subImages) : product.subImages || [];
      const lowestVariantPrice = product.variants.length > 0
        ? Math.min(...product.variants.map(v => parseFloat(v.price)))
        : parseFloat(product.salePrice);
      const discount = product.mrp && product.salePrice && parseFloat(product.mrp) > parseFloat(product.salePrice)
        ? `${Math.round(((parseFloat(product.mrp) - parseFloat(product.salePrice)) / parseFloat(product.mrp)) * 100)}% Off`
        : '';

      return {
        productId: product.productId,
        imageUrl: product.mainImage || '',
        hoverImageUrl: subImages.length > 0 ? subImages[0] : product.mainImage || '',
        title: product.productName || '',
        price: `$${lowestVariantPrice.toFixed(2)}`,
        originalPrice: product.mrp ? `$${parseFloat(product.mrp).toFixed(2)}` : '',
        discount: discount,
        linkUrl: `#product-${product.productId}`
      };
    });

    res.status(200).json({ success: true, data: parsedProducts });
  } catch (error) {
    console.error('Error in getAllProductsPublic:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductsByTypePublic = async (req, res) => {
  try {
    const { typeSlug } = req.params;

    // Find the type by typeSlug
    const type = await Type.findOne({
      where: { typeSlug },
      attributes: ['typeId'],
    });

    if (!type) {
      return res.status(404).json({ success: false, message: 'Type not found' });
    }

    // Fetch products associated with categories that belong to the specified type
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          as: 'categories',
          attributes: ['categoryId', 'categoryName'],
          through: { attributes: [] },
          where: { typeId: type.typeId }, // Filter by typeId
        },
        { model: SubCategory, as: 'subCategories', attributes: ['subCategoryId', 'subCategoryName'], through: { attributes: [] } },
        { model: Variant, as: 'variants', attributes: ['variantId', 'sku', 'stock', 'price', 'image', 'options'] },
      ],
      order: [['updatedAt', 'DESC']],
    });

    const parsedProducts = products.map(product => {
      const subImages = typeof product.subImages === 'string' ? JSON.parse(product.subImages) : product.subImages || [];
      const lowestVariantPrice = product.variants.length > 0
        ? Math.min(...product.variants.map(v => parseFloat(v.price)))
        : parseFloat(product.salePrice);
      const discount = product.mrp && product.salePrice && parseFloat(product.mrp) > parseFloat(product.salePrice)
        ? `${Math.round(((parseFloat(product.mrp) - parseFloat(product.salePrice)) / parseFloat(product.mrp)) * 100)}% Off`
        : '';

      return {
        productId: product.productId,
        imageUrl: product.mainImage || '',
        hoverImageUrl: subImages.length > 0 ? subImages[0] : product.mainImage || '',
        title: product.productName || '',
        price: `$${lowestVariantPrice.toFixed(2)}`,
        originalPrice: product.mrp ? `$${parseFloat(product.mrp).toFixed(2)}` : '',
        discount: discount,
        linkUrl: `#product-${product.productId}`,
      };
    });

    res.status(200).json({ success: true, data: parsedProducts });
  } catch (error) {
    console.error('Error in getProductsByTypePublic:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
const getProductByIdPublic = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findByPk(productId, {
      include: [
        {
          model: Category,
          as: 'categories',
          attributes: ['categoryId', 'categoryName'],
          through: { attributes: [] },
          include: [
            {
              model: Type,
              as: 'type',
              attributes: ['typeId', 'typeName'],
            },
          ],
        },
        {
          model: SubCategory,
          as: 'subCategories',
          attributes: ['subCategoryId', 'subCategoryName'],
          through: { attributes: [] },
        },
        {
          model: Variant,
          as: 'variants',
          attributes: ['variantId', 'sku', 'stock', 'price', 'image', 'options'],
        },
      ],
      order: [['updatedAt', 'DESC']],
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

    const lowestVariantPrice = parsedProduct.variants.length > 0
      ? Math.min(...parsedProduct.variants.map(v => parseFloat(v.price)))
      : parseFloat(parsedProduct.salePrice);

    const discount = parsedProduct.mrp && parsedProduct.salePrice && parseFloat(parsedProduct.mrp) > parseFloat(parsedProduct.salePrice)
      ? `${Math.round(((parseFloat(parsedProduct.mrp) - parseFloat(parsedProduct.salePrice)) / parseFloat(parsedProduct.mrp)) * 100)}% Off`
      : '';

    const formattedProduct = {
      productId: parsedProduct.productId,
      imageUrl: parsedProduct.mainImage || '',
      hoverImageUrl: parsedProduct.subImages.length > 0 ? parsedProduct.subImages[0] : parsedProduct.mainImage || '',
      title: parsedProduct.productName || '',
      price: `$${lowestVariantPrice.toFixed(2)}`,
      originalPrice: parsedProduct.mrp ? `$${parseFloat(parsedProduct.mrp).toFixed(2)}` : '',
      discount: discount,
      linkUrl: `#product-${parsedProduct.productId}`,
      categories: parsedProduct.categories.map(category => ({
        categoryId: category.categoryId,
        categoryName: category.categoryName,
        type: category.type ? {
          typeId: category.type.typeId,
          typeName: category.type.typeName,
        } : null,
      })),
      subCategories: parsedProduct.subCategories.map(subCategory => ({
        subCategoryId: subCategory.subCategoryId,
        subCategoryName: subCategory.subCategoryName,
      })),
      variants: parsedProduct.variants,
      description: parsedProduct.description || '',
      weight: parsedProduct.weight ? parseFloat(parsedProduct.weight) : null,
      availableStatus: parsedProduct.availableStatus,
      createdAt: parsedProduct.createdAt,
      updatedAt: parsedProduct.updatedAt,
    };

    res.status(200).json({ success: true, data: formattedProduct });
  } catch (error) {
    console.error('Error in getProductByIdPublic:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

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
      subImages: typeof product.subImages === 'string' ? JSON.parse(product.subImages) : product.subImages,
      variants: product.variants.map(variant => ({
        ...variant,
        options: typeof variant.options === 'string' ? JSON.parse(variant.options) : variant.options || [],
      })),
    };

    res.status(200).json({ success: true, data: parsedProduct });
  } catch (error) {
    console.error('Error in getProductById:', error);
    res.status(500).error({ success: false, message: error.message });
    return;
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
      weight,
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

    if (!parsedCategoryIds.length || !parsedSubCategoryIds.length || !productName || !productName || !availableStatus || !mrp || !salePrice) {
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
      weight: weight ? parseFloat(weight) : null,
    });

    // Associate categories and subcategories
    await product.setCategories(parsedCategoryIds);
    await product.setSubCategories(parsedSubCategoryIds);

    const variantImageMap = {};
    variantImageFiles.forEach((file) => {
      variantImageMap[file.originalname] = `/uploads/${file.filename}`;
    });

    console.log('Variants Image Files:', variantImageFiles);
    console.log('Variants Image Map:', variantImageMap);

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
        weight,
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
        weight: weight ? parseFloat(weight) : null,
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
    getAllProductsPublic,
    getProductsByTypePublic,
    getProductByIdPublic
  };