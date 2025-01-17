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


const cleanImagePath = (imagePath) => {
  const match = imagePath.match(/\/uploads\/products\/.*$/);
  return match ? match[0] : imagePath;
};
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    // Handle image updates
    if (req.files || req.body.removedImages) {
     
      if (req.files?.mainImage) {
        if (product.mainImage) {
          const oldMainImagePath = path.join(__dirname, '..', 'public', cleanImagePath(product.mainImage));
          await fs.unlink(oldMainImagePath).catch(console.error);
        }
        product.mainImage = `/uploads/products/${req.files.mainImage[0].filename}`;
      }
      const existingImages = JSON.parse(req.body.existingImages || '[]')
      .map(cleanImagePath);
    const removedImages = JSON.parse(req.body.removedImages || '[]')
      .map(cleanImagePath);
      for (const imageUrl of removedImages) {
        const imagePath = path.join(__dirname, '..', 'public', cleanImagePath(imageUrl));
        await fs.unlink(imagePath).catch(console.error);
      }
      let updatedAdditionalImages = [...existingImages];
      if (req.files?.additionalImages) {
        const newImages = req.files.additionalImages.map(file => 
          `/uploads/products/${file.filename}`
        );
        updatedAdditionalImages = [...updatedAdditionalImages, ...newImages];
      }
      product.additionalImages = updatedAdditionalImages
        .filter(img => !removedImages.includes(cleanImagePath(img)))
        .map(cleanImagePath);
    }
    const updateFields = [
      'title', 'description', 'price', 'originalPrice', 'clubPrice',
      'category', 'brand', 'deliveryInfo', 'isActive'
    ];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });
    if (req.body.sizes) product.sizes = JSON.parse(req.body.sizes);
    if (req.body.sizeAndFit) product.sizeAndFit = JSON.parse(req.body.sizeAndFit);
    if (req.body.materialCare) product.materialCare = JSON.parse(req.body.materialCare);
    if (req.body.productDetails) product.productDetails = JSON.parse(req.body.productDetails);

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    if (req.files) {
      Object.values(req.files).flat().forEach(file => {
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
    const imagesToDelete = [];
    if (product.mainImage) {
      imagesToDelete.push(product.mainImage);
    }
    if (product.additionalImages && product.additionalImages.length > 0) {
      imagesToDelete.push(...product.additionalImages);
    }
    for (const imagePath of imagesToDelete) {
      try {
        const cleanPath = imagePath.replace(/^\/uploads\/products\//, '');
        const fullPath = path.join(__dirname, '..', 'public', 'uploads', 'products', cleanPath);
        await fs.unlink(fullPath).catch(console.error);
      } catch (unlinkError) {
        console.error(`Error deleting image ${imagePath}:`, unlinkError);
      }
    }
    await product.deleteOne();
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
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