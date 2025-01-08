const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  checkStockAvailability
} = require('../controllers/productController');

// Configure upload fields for multiple images
const uploadFields = [
  { name: 'mainImage', maxCount: 1 },
  { name: 'additionalImages', maxCount: 4 }
];

// Public routes
router.get('/getAllproducts', getProducts);
router.get('/:id', getProduct);
router.get('/products/availability/:productId/:size', checkStockAvailability);
// Protected routes (require authentication)
router.use(authenticate);

// Admin only routes
router.post('/addproduct', authorizeAdmin, upload.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'additionalImages', maxCount: 5 }
]), createProduct);

router.put('/update/:id', 
  authorizeAdmin, 
  upload.fields(uploadFields), 
  updateProduct
);

router.delete('/delete/:id', 
  authorizeAdmin, 
  deleteProduct
);

module.exports = router;