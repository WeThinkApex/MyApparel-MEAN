const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required']
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required']
  },
  originalPrice: {
    type: Number,
    required: [true, 'Original price is required']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['GIRLS FASHION', 'BOYS FASHION']
  },
  brand: {
    type: String,
    required: [true, 'Brand is required']
  },
  mainImage: {
    type: String,
    required: [true, 'Main product image is required']
  },
  additionalImages: [{
    type: String
  }],
  sizes: [{
    name: String,
    stock: Number
  }],
  sizeAndFit: [String],
  materialCare: [String],
  productDetails: [String],
  deliveryInfo: {
    type: String,
    default: 'Standard delivery in 4-5 business days'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Middleware to calculate totalStock before saving
productSchema.pre('save', function(next) {
  this.totalStock = this.sizes.reduce((total, size) => total + size.stock, 0);
  next();
});

module.exports = mongoose.model('Product', productSchema);