const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus
} = require('../controllers/orderController');

router.post('/create', createOrder);
router.get('/user/:userId', getUserOrders);
router.get('/:orderId', getOrderById);
router.put('/:orderId/status', updateOrderStatus);

module.exports = router;