const { sequelize, Order, Customer, Variant } = require('../models');
const CustomError = require('../utils/errorHandler');
const { sendEmail } = require('../utils/emailService');
const { sendOrderDetailsEmail } = require('../utils/commonEmail'); 

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
        order: [['updatedAt', 'DESC']] 
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
        attributes: ['orderId', 'customerId', 'products', 'total', 'status', 'paymentMethod', 'shippingMethod', 'orderNOTES', 'createdAt', 'updatedAt'],
      });

      if (!order) {
        throw new CustomError('Order not found', 404);
      }

      console.log('Order Details:', order.toJSON());

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

  async getProductVariants(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        throw new CustomError('Product ID is required', 400);
      }

      const variants = await Variant.findAll({
        where: { productId: id },
        attributes: ['variantId', 'sku', 'stock', 'price', 'image', 'options'],
      });

      return res.status(200).json({
        success: true,
        data: variants,
      });
    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      next(new CustomError('Failed to fetch variants', 500));
    }
  },

  async createOrder(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { customerId, products, total, paymentMethod, shippingMethod, orderNotes } = req.body;

      console.log('CreateOrder - Request payload:', JSON.stringify(req.body, null, 2));

      if (!customerId || !products || !Array.isArray(products) || products.length === 0 || !total || !paymentMethod) {
        throw new CustomError('Missing required fields', 400);
      }

      const customer = await Customer.findOne({ where: { customerId, isActive: true }, transaction });
      if (!customer) {
        throw new CustomError('Customer not found or inactive', 404);
      }

      for (const product of products) {
        if (!product.productId || !product.variantId || !product.quantity || product.quantity <= 0) {
          throw new CustomError('Invalid product or variant details: productId, variantId, and quantity are required', 400);
        }
        if (product.discount && (typeof product.discount !== 'number' || product.discount < 0 || product.discount > 100)) {
          throw new CustomError('Discount must be a number between 0 and 100', 400);
        }

        const variant = await Variant.findOne({
          where: { variantId: product.variantId, productId: product.productId },
          transaction,
        });
        if (!variant) {
          throw new CustomError(`Variant ${product.variantId} not found for product ${product.productId}`, 404);
        }
        if (variant.stock < product.quantity) {
          throw new CustomError(`Insufficient stock for variant ${variant.sku} (Available: ${variant.stock})`, 400);
        }

        await variant.update({ stock: variant.stock - product.quantity }, { transaction });
      }

      const validPaymentMethods = ['online_payment', 'cod', 'direct_bank_transfer'];
      if (!validPaymentMethods.includes(paymentMethod)) {
        throw new CustomError('Invalid payment method', 400);
      }

      const order = await Order.create({
        customerId,
        products,
        total,
        paymentMethod,
        shippingMethod,
        orderNotes,
        status: 'Pending Payment',
      }, { transaction, validate: true });

      console.log('CreateOrder - Created order:', JSON.stringify(order.toJSON(), null, 2));

      await transaction.commit();

      return res.status(201).json({
        success: true,
        data: order,
      });
    } catch (error) {
      await transaction.rollback();
      console.error('CreateOrder - Error:', error);
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
    const transaction = await sequelize.transaction();
    try {
      const { id } = req.params;
      const { products, total, status, paymentMethod, shippingMethod, orderNotes } = req.body;

      console.log('UpdateOrder - Request payload:', JSON.stringify(req.body, null, 2));

      if (!id) {
        throw new CustomError('Order ID is required', 400);
      }

      const order = await Order.findOne({
        where: { orderId: id },
        attributes: ['orderId', 'customerId', 'products', 'total', 'status', 'paymentMethod', 'shippingMethod', 'orderNotes', 'createdAt', 'updatedAt'],
        transaction,
      });
      if (!order) {
        throw new CustomError('Order not found', 404);
      }

      console.log('UpdateOrder - Fetched order:', JSON.stringify(order.toJSON(), null, 2));

      let updateStatus = order.status;
      if (status) {
        const validStatuses = ['Processing', 'Pending Payment', 'On Hold', 'Shipped', 'Ready to Ship', 'Cancelled'];
        if (!validStatuses.includes(status)) {
          throw new CustomError('Invalid status', 400);
        }
        updateStatus = status;
      } else if (!updateStatus || updateStatus === '') {
        updateStatus = 'Pending Payment';
      }

      let updatePaymentMethod = order.paymentMethod;
      if (paymentMethod) {
        const validPaymentMethods = ['online_payment', 'cod', 'direct_bank_transfer'];
        if (!validPaymentMethods.includes(paymentMethod)) {
          throw new CustomError('Invalid payment method', 400);
        }
        updatePaymentMethod = paymentMethod;
      } else if (!updatePaymentMethod || updatePaymentMethod === '') {
        updatePaymentMethod = 'online_payment';
      }

      if (products) {
        if (!Array.isArray(products) || products.length === 0) {
          throw new CustomError('Invalid product details', 400);
        }

        let existingProducts = Array.isArray(order.products) ? order.products : [];
        if (typeof order.products === 'string') {
          try {
            existingProducts = JSON.parse(order.products);
          } catch (e) {
            console.error('UpdateOrder - Failed to parse existing products:', e);
            throw new CustomError('Invalid existing product data', 500);
          }
        }
        console.log('UpdateOrder - Parsed existing products:', JSON.stringify(existingProducts, null, 2));

        const adjustedProducts = new Set();

        for (const existing of existingProducts) {
          const newProduct = products.find(p => p.productId === existing.productId && p.variantId === existing.variantId);
          console.log(`UpdateOrder - Processing existing product: ${JSON.stringify(existing)}`);
          if (!newProduct) {
            if (existing.variantId) {
              const variant = await Variant.findOne({
                where: { variantId: existing.variantId },
                transaction,
              });
              if (variant) {
                console.log(`UpdateOrder - Restoring stock for removed variant ${variant.sku}: +${existing.quantity}`);
                await variant.update({ stock: variant.stock + existing.quantity }, { transaction });
              }
            }
          } else if (newProduct.quantity !== existing.quantity) {
            const variant = await Variant.findOne({
              where: { variantId: existing.variantId },
              transaction,
            });
            if (variant) {
              const quantityDiff = existing.quantity - newProduct.quantity;
              console.log(`UpdateOrder - Adjusting stock for variant ${variant.sku}: +${quantityDiff}`);
              await variant.update({ stock: variant.stock + quantityDiff }, { transaction });
              adjustedProducts.add(`${newProduct.productId}:${newProduct.variantId}`);
            }
          }
        }

        for (const product of products) {
          if (!product.productId || !product.variantId || !product.quantity || product.quantity <= 0) {
            throw new CustomError('Invalid product or variant details: productId, variantId, and quantity are required', 400);
          }
          if (product.discount && (typeof product.discount !== 'number' || product.discount < 0 || product.discount > 100)) {
            throw new CustomError('Discount must be a number between 0 and 100', 400);
          }

          const existingProduct = existingProducts.find(p => p.productId === product.productId && p.variantId === product.variantId);
          console.log(`UpdateOrder - Existing product for ${product.variantId}: ${JSON.stringify(existingProduct)}`);

          const isNewOrChanged = !existingProduct || 
            existingProduct.quantity !== product.quantity || 
            Number(existingProduct.discount) !== Number(product.discount);
          console.log(`UpdateOrder - Product ${product.variantId} isNewOrChanged: ${isNewOrChanged}`);

          if (isNewOrChanged) {
            const variant = await Variant.findOne({
              where: { variantId: product.variantId, productId: product.productId },
              transaction,
            });
            if (!variant) {
              throw new CustomError(`Variant ${product.variantId} not found for product ${product.productId}`, 404);
            }

            if (!adjustedProducts.has(`${product.productId}:${product.variantId}`)) {
              const requiredStock = existingProduct ? product.quantity - existingProduct.quantity : product.quantity;
              console.log(`UpdateOrder - Variant ${variant.sku} - Required stock: ${requiredStock}, Available: ${variant.stock}`);

              if (variant.stock < requiredStock) {
                throw new CustomError(`Insufficient stock for variant ${variant.sku} (Available: ${variant.stock})`, 400);
              }

              if (requiredStock !== 0) {
                console.log(`UpdateOrder - Updating stock for variant ${variant.sku}: ${-requiredStock}`);
                await variant.update({ stock: variant.stock - requiredStock }, { transaction });
              }
            } else {
              console.log(`UpdateOrder - Skipping stock update for variant ${variant.sku} (already adjusted)`);
            }
          }
        }
      }

      const updateData = {
        products: products || order.products,
        total: total || order.total,
        status: updateStatus,
        paymentMethod: updatePaymentMethod,
        shippingMethod: shippingMethod || order.shippingMethod,
        orderNotes: orderNotes || order.orderNotes,
        updatedAt: new Date(),
      };
      console.log('UpdateOrder - Update data:', JSON.stringify(updateData, null, 2));

      try {
        await order.update(updateData, { transaction, validate: true });
      } catch (validationError) {
        console.error('UpdateOrder - Validation error:', validationError);
        throw new CustomError(`Failed to update order due to validation: ${validationError.message}`, 400);
      }

      const updatedOrder = await Order.findOne({
        where: { orderId: id },
        attributes: ['orderId', 'customerId', 'products', 'total', 'status', 'paymentMethod', 'shippingMethod', 'orderNotes', 'createdAt', 'updatedAt'],
        transaction,
      });
      console.log('UpdateOrder - Verified updated order:', JSON.stringify(updatedOrder.toJSON(), null, 2));

      await transaction.commit();

      return res.status(200).json({
        success: true,
        data: updatedOrder,
      });
    } catch (error) {
      await transaction.rollback();
      console.error('UpdateOrder - Error:', error);
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      next(new CustomError(`Failed to update order: ${error.message}`, 500));
    }
  },

  async bulkUpdateStatus(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { orderIds, status } = req.body;

      if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
        throw new CustomError('Order IDs are required and must be an array', 400);
      }

      const validStatuses = ['Processing', 'Pending Payment', 'On Hold', 'Shipped', 'Ready to Ship', 'Cancelled'];
      if (!validStatuses.includes(status)) {
        throw new CustomError('Invalid status', 400);
      }

      const orders = await Order.findAll({
        where: { orderId: orderIds },
        include: [{
          model: Customer,
          as: 'customer',
          attributes: ['customerId', 'firstName', 'lastName', 'email', 'shippingAddress', 'billingAddress']
        }],
        attributes: ['orderId', 'customerId', 'products', 'total', 'status', 'paymentMethod', 'shippingMethod', 'orderNotes', 'createdAt', 'updatedAt'],
        transaction,
      });

      if (orders.length !== orderIds.length) {
        const missingIds = orderIds.filter(id => !orders.find(o => o.orderId === id));
        throw new CustomError(`Orders not found: ${missingIds.join(', ')}`, 404);
      }

      // Update status in DB
      for (const order of orders) {
        await order.update({ status, updatedAt: new Date() }, { transaction });
      }

      // Send emails using sendOrderDetailsEmail
      const emailPromises = orders.map(async (order) => {
        try {
          await sendOrderDetailsEmail(order);
          console.log(`Email sent for order ${order.orderId}`);
        } catch (err) {
          console.error(`Failed to send email for order ${order.orderId}:`, err.message);
        }
      });

      await Promise.all(emailPromises);
      await transaction.commit();

      res.status(200).json({
        success: true,
        message: `Updated status to ${status} for ${orders.length} orders`,
      });
    } catch (error) {
      await transaction.rollback();
      console.error('BulkUpdateStatus - Error:', error);
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      next(new CustomError(`Failed to update orders: ${error.message}`, 500));
    }
  },

  async cancelOrder(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { id } = req.params;

      if (!id) {
        throw new CustomError('Order ID is required', 400);
      }

      const order = await Order.findOne({ where: { orderId: id }, transaction });
      if (!order) {
        throw new CustomError('Order not found', 404);
      }

      if (order.status === 'Cancelled') {
        throw new CustomError('Order is already cancelled', 400);
      }

      const products = Array.isArray(order.products) ? order.products : [];
      for (const product of products) {
        if (product.variantId) {
          const variant = await Variant.findOne({
            where: { variantId: product.variantId },
            transaction,
          });
          if (variant) {
            await variant.update({ stock: variant.stock + product.quantity }, { transaction });
          }
        }
      }

      await order.update({ status: 'Cancelled', updatedAt: new Date() }, { transaction });

      await transaction.commit();

      return res.status(200).json({
        success: true,
        message: 'Order cancelled successfully',
      });
    } catch (error) {
      await transaction.rollback();
      console.error('CancelOrder - Error:', error);
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      next(new CustomError('Failed to cancel order', 500));
    }
  },
};

module.exports = orderController;