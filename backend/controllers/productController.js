const Product = require('../models/Product');
const fs = require('fs').promises;
const path = require('path');

exports.createProduct = async (req, res) => {
  try {
    if (!req.files || !req.files.mainImage) {
      return res.status(400).json({ message: 'Main product image is required' });
    }
    const mainImageUrl = `/uploads/products/${req.files.mainImage[0].filename}`;
    const additionalImageUrls = [];
    if (req.files.additionalImages) {
      req.files.additionalImages.forEach(file => {
        additionalImageUrls.push(`/uploads/products/${file.filename}`);
      });
    }
    const sizes = JSON.parse(req.body.sizes || '[]');
    const sizeAndFit = JSON.parse(req.body.sizeAndFit || '[]');
    const materialCare = JSON.parse(req.body.materialCare || '[]');
    const productDetails = JSON.parse(req.body.productDetails || '[]');

    const product = new Product({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      originalPrice: req.body.originalPrice,
      clubPrice: req.body.clubPrice,
      category: req.body.category,
      brand: req.body.brand,
      mainImage: mainImageUrl,
      additionalImages: additionalImageUrls,
      sizes: sizes,
      sizeAndFit: sizeAndFit,
      materialCare: materialCare,
      productDetails: productDetails,
      deliveryInfo: req.body.deliveryInfo,
      isActive: req.body.isActive === 'true'
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    if (req.files) {
      Object.values(req.files).flat().forEach(async (file) => {
        try {
          await fs.unlink(file.path);
        } catch (unlinkError) {
          console.error('Error deleting file:', unlinkError);
        }
      });
    }
    res.status(400).json({ message: error.message });
  }
};
// Get all products with filtering and pagination
exports.getProducts = async (req, res) => {
  try {
    const {
      category,
      brand,
      search,
      sort,
      page = 1,
      limit = 10,
      minPrice,
      maxPrice,
      inStock
    } = req.query;

    const query = { isActive: true };
    // Apply filters
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (inStock === 'true') query.totalStock = { $gt: 0 };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }
    // Calculate skip value for pagination
    const skip = (Number(page) - 1) * Number(limit);
    // Build sort object
    let sortObj = {};
    if (sort) {
      const [field, order] = sort.split(':');
      sortObj[field] = order === 'desc' ? -1 : 1;
    } else {
      sortObj = { createdAt: -1 };
    }

    const products = await Product.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.json({
      products,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    // Handle image updates
    if (req.files?.length > 0) {
      const mainImage = req.files.find(file => file.fieldname === 'mainImage');
      const additionalImages = req.files.filter(file => file.fieldname === 'additionalImages');

      if (mainImage) {
        if (product.mainImage) {
          const oldMainImagePath = path.join(__dirname, '..', 'public', product.mainImage);
          await fs.unlink(oldMainImagePath).catch(console.error);
        }
        product.mainImage = `/uploads/products/${mainImage.filename}`;
      }

      if (additionalImages.length > 0) {
        // Delete old additional images
        for (const image of product.images) {
          const oldImagePath = path.join(__dirname, '..', 'public', image.url);
          await fs.unlink(oldImagePath).catch(console.error);
        }
        product.images = additionalImages.map(file => ({
          url: `/uploads/products/${file.filename}`,
          alt: product.title
        }));
      }
    }
    // Update other fields
    const updateFields = [
      'title', 'description', 'price', 'originalPrice', 'clubPrice',
      'category', 'brand', 'sizeAndFit', 'materialCare', 'productDetails',
      'deliveryInfo'
    ];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (['sizeAndFit', 'materialCare', 'productDetails'].includes(field)) {
          product[field] = JSON.parse(req.body[field]);
        } else {
          product[field] = req.body[field];
        }
      }
    });
    // Update sizes if provided
    if (req.body.sizes) {
      product.sizes = JSON.parse(req.body.sizes);
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path).catch(console.error);
      });
    }
    res.status(400).json({ message: error.message });
  }
};
// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    // Delete all associated images
    const imagePaths = [
      product.mainImage,
      ...product.images.map(img => img.url)
    ];

    for (const imagePath of imagePaths) {
      const fullPath = path.join(__dirname, '..', 'public', imagePath);
      await fs.unlink(fullPath).catch(console.error);
    }
    await product.deleteOne();
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check stock availability
exports.checkStockAvailability = async (req, res) => {
  try {
    const { productId, size } = req.params;
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const sizeData = product.sizes.find(s => s.name === size);
    res.json({
      available: sizeData ? sizeData.stock > 0 : false,
      stock: sizeData ? sizeData.stock : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};