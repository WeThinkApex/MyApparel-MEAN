const Product = require('../models/Product');
const fs = require('fs').promises;
const path = require('path');

exports.createProduct = async (req, res) => {
  try {
    const imageUrl = req.file ? `/uploads/products/${req.file.filename}` : null;
    if (!imageUrl) {
      return res.status(400).json({ message: 'Product image is required' });
    }
    const product = new Product({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      salePrice: req.body.salePrice,
      category: req.body.category,
      brand: req.body.brand,
      imageUrl,
      stock: req.body.stock || 0
    });
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    res.status(400).json({ message: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { category, brand, search, sort, page = 1, limit = 10 } = req.query;
    const query = {};
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    const skip = (page - 1) * limit;
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
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (req.file) {
      if (product.imageUrl) {
        const oldImagePath = path.join(__dirname, '..', 'public', product.imageUrl);
        await fs.unlink(oldImagePath).catch(console.error);
      }
      product.imageUrl = `/uploads/products/${req.file.filename}`;
    }
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        product[key] = req.body[key];
      }
    });

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    res.status(400).json({ message: error.message });
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.imageUrl) {
      const imagePath = path.join(__dirname, '..', product.imageUrl); 
      try {
        await fs.access(imagePath); 
        await fs.unlink(imagePath); 
        console.log("Image file deleted:", imagePath);
      } catch (err) {
        if (err.code === 'ENOENT') {
          console.log("Image file does not exist, skipping deletion:", imagePath);
        } else {
          throw err; 
        }
      }
    }
    await product.deleteOne(); // Use deleteOne explicitly
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


