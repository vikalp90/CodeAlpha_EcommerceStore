const Order = require('../models/Order');
const Cart = require('../models/Cart');

// Create order from cart
exports.createOrder = async (req, res) => {
  try {
    const { userId, shippingAddress } = req.body;

    // Get user's cart with product details
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Prepare order items and calculate total
    let totalAmount = 0;
    const orderItems = cart.items.map(item => {
      const itemTotal = item.product.price * item.quantity;
      totalAmount += itemTotal;
      return {
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      };
    });

    // Create the order
    const newOrder = new Order({
      user: userId,
      items: orderItems,
      totalAmount,
      shippingAddress
    });

    await newOrder.save();

    // Clear the cart after order is placed
    cart.items = [];
    await cart.save();

    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all orders of a user
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).populate('items.product');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('items.product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update order status (admin use)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.orderId, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};