const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// Protect all routes
router.use(authenticate);

// Get all products - accessible by all authenticated users
router.get('/getAllproducts', getProducts);

// Get single product - accessible by all authenticated users
router.get('/:id', getProduct);

// Admin only routes
router.post('/addproduct', authorizeAdmin, upload.single('image'), createProduct);
router.put('/update/:id', authorizeAdmin, upload.single('image'), updateProduct);
router.delete('/delete/:id', authorizeAdmin, deleteProduct);

module.exports = router;