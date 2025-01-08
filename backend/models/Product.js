const mongoose = require('mongoose');
const AGE_RANGES = [
  '1-2Y', '2-3Y', '3-4Y', '4-5Y', '5-6Y', 
  '6-7Y', '7-8Y', '8-9Y', '9-10Y', '10-11Y', 
  '11-12Y', '12-13Y', '13-14Y'
];
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
    name: {
      type: String,
      enum: AGE_RANGES,  // This ensures only valid age ranges can be used
      required: true
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    }
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

productSchema.statics.getAvailableSizes = function() {
  return AGE_RANGES;
};

// Add a method to check if a size is valid
productSchema.methods.isValidSize = function(size) {
  return AGE_RANGES.includes(size);
};
productSchema.pre('save', function(next) {
  this.totalStock = this.sizes.reduce((total, size) => total + size.stock, 0);
  next();
});

module.exports = mongoose.model('Product', productSchema);