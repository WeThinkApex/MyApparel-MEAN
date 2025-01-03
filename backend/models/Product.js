const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required']
  },
  description: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: [true, 'Product price is required']
  },
  salePrice: {
    type: Number,
    required: false
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['GIRLS FASHION', 'BOYS FASHION', 'FOOTWEAR', 'TOYS', 'DIAPRING', 
           'FEEDING', 'BATH', 'NURSERY', 'MOMS', 'HEALTH', 'BOUTIQUES']
  },
  brand: {
    type: String,
    required: [true, 'Brand is required']
  },
  imageUrl: {
    type: String,
    required: [true, 'Product image is required']
  },
  stock: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);