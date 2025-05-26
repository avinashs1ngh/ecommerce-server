const { Order, Customer } = require('../models');
const CustomError = require('../utils/errorHandler');

const orderController = {
  async getAllOrders(req, res, next) {
    try {
      const { limit = 10, offset = 0, status } = req.query;

      const where = {};
      if (status) {
        where.status = status;
      }

      const orders = await Order.findAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        include: [{ 
          model: Customer, 
          as: 'customer', 
          attributes: ['customerId', 'firstName', 'lastName', 'email', 'shippingAddress', 'billingAddress'] 
        }],
        attributes: ['orderId', 'customerId', 'products', 'total', 'status', 'paymentMethod', 'shippingMethod', 'orderNotes', 'createdAt', 'updatedAt'],
      });

      if (!orders.length) {
        throw new CustomError('No orders found', 404);
      }

      return res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      next(new CustomError('Failed to fetch orders', 500));
    }
  },

  async getOrderDetails(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new CustomError('Order ID is required', 400);
      }

      const order = await Order.findOne({
        where: { orderId: id },
        include: [{ 
          model: Customer, 
          as: 'customer', 
          attributes: ['customerId', 'firstName', 'lastName', 'email', 'shippingAddress', 'billingAddress'] 
        }],
        attributes: ['orderId', 'customerId', 'products', 'total', 'status', 'paymentMethod', 'shippingMethod', 'orderNotes', 'createdAt', 'updatedAt'],
      });

      if (!order) {
        throw new CustomError('Order not found', 404);
      }

      return res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      next(new CustomError('Failed to fetch order details', 500));
    }
  },

  async createOrder(req, res, next) {
    try {
      const { customerId, products, total, paymentMethod, shippingMethod, orderNotes } = req.body;

      // Validate required fields
      if (!customerId || !products || !Array.isArray(products) || products.length === 0 || !total || !paymentMethod) {
        throw new CustomError('Missing required fields', 400);
      }

      // Validate customer
      const customer = await Customer.findOne({ where: { customerId, isActive: true } });
      if (!customer) {
        throw new CustomError('Customer not found or inactive', 404);
      }

      // Validate products array
      for (const product of products) {
        if (!product.productId || !product.quantity || product.quantity <= 0) {
          throw new CustomError('Invalid product details', 400);
        }
        if (product.discount && (typeof product.discount !== 'number' || product.discount < 0 || product.discount > 100)) {
          throw new CustomError('Discount must be a number between 0 and 100', 400);
        }
      }

      // Validate payment method
      const validPaymentMethods = ['online_payment', 'cod', 'direct_bank_transfer'];
      if (!validPaymentMethods.includes(paymentMethod)) {
        throw new CustomError('Invalid payment method', 400);
      }

      // Log the data before creating the order
      console.log('Creating order with data:', { customerId, products, total, paymentMethod, shippingMethod, orderNotes });

      const order = await Order.create({
        customerId,
        products,
        total,
        paymentMethod,
        shippingMethod,
        orderNotes,
       status: 'Pending Payment',
      });

      return res.status(201).json({
        success: true,
        data: order,
      });
    } catch (error) {
      console.error('Create order error:', error);
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      next(new CustomError(`Failed to create order: ${error.message}`, 500));
    }
  },

  async updateOrder(req, res, next) {
    try {
      const { id } = req.params;
      const { products, total, status, paymentMethod, shippingMethod, orderNotes } = req.body;

      if (!id) {
        throw new CustomError('Order ID is required', 400);
      }

      const order = await Order.findOne({ where: { orderId: id } });
      if (!order) {
        throw new CustomError('Order not found', 404);
      }

      // Validate status if provided
      if (status) {
  const validStatuses = ['Processing', 'Pending Payment', 'On Hold', 'Shipped', 'Ready to Ship', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    throw new CustomError('Invalid status', 400);
  }
}

      // Validate payment method if provided
      if (paymentMethod) {
        const validPaymentMethods = ['online_payment', 'cod', 'direct_bank_transfer'];
        if (!validPaymentMethods.includes(paymentMethod)) {
          throw new CustomError('Invalid payment method', 400);
        }
      }

      // Validate products if provided
      if (products) {
        if (!Array.isArray(products) || products.length === 0) {
          throw new CustomError('Invalid product details', 400);
        }
        for (const product of products) {
          if (!product.productId || !product.quantity || product.quantity <= 0) {
            throw new Error('Invalid product details');
          }
          if (product.discount && (typeof product.discount !== 'number' || product.discount < 0 || product.discount > 100)) {
            throw new Error('Discount must be a number between 0 and 100');
          }
        }
      }

      await order.update({
        products: products || order.products,
        total: total || order.total,
        status: status || order.status,
        paymentMethod: paymentMethod || order.paymentMethod,
        shippingMethod: shippingMethod || order.shippingMethod,
        orderNotes: orderNotes || order.orderNotes,
        updatedAt: new Date(),
      });

      return res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      console.error('Update order error:', error);
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      next(new CustomError(`Failed to update order: ${error.message}`, 500));
    }
  },

  async cancelOrder(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new CustomError('Order ID is required', 400);
      }

      const order = await Order.findOne({ where: { orderId: id } });
      if (!order) {
        throw new CustomError('Order not found', 404);
      }

      if (order.status === 'cancelled') {
        throw new CustomError('Order is already cancelled', 400);
      }

      await order.update({ status: 'cancelled', updatedAt: new Date() });

      return res.status(200).json({
        success: true,
        message: 'Order cancelled successfully',
      });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      next( new CustomError('Failed to cancel order', 500));
    }
  },
};

module.exports = orderController;