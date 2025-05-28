const { sequelize, Order, Customer, Variant } = require('../models');
const CustomError = require('../utils/errorHandler');
const { sendEmail } = require('../utils/emailService');
const { sendOrderDetailsEmail } = require('../utils/commonEmail'); 

const orderController = {
 async getAllOrders(req, res, next) {
    try {
      const { limit = 10, offset = 0, status, paymentMethod, customerName } = req.query;

      console.log(`getAllOrders - Query: limit=${limit}, offset=${offset}, status=${status}, paymentMethod=${paymentMethod}, customerName=${customerName}`);

      const where = {};
      if (status) {
        where.status = status;
      }
      if (paymentMethod) {
        where.paymentMethod = paymentMethod;
      }

      const include = [{
        model: Customer,
        as: 'customer',
        attributes: ['customerId', 'firstName', 'lastName', 'email', 'shippingAddress', 'billingAddress'],
        required: false, // Make Customer optional
        where: customerName ? {
          [Op.or]: [
            { firstName: { [Op.iLike]: `%${customerName}%` } },
            { lastName: { [Op.iLike]: `%${customerName}%` } },
          ],
        } : undefined,
      }];

      // Debug: Log the raw query
      const orders = await Order.findAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        include,
        attributes: ['orderId', 'customerId', 'products', 'total', 'status', 'paymentMethod', 'shippingMethod', 'orderNotes', 'createdAt', 'updatedAt'],
        order: [['updatedAt', 'DESC']],
        logging: (sql) => console.log('getAllOrders - SQL Query:', sql), // Log raw SQL
      });

      console.log(`getAllOrders - Found ${orders.length} orders`);

      return res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      console.error('getAllOrders - Error:', error);
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

      console.log(`getOrderDetails - Order ID: ${id}`);

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

      console.log('getOrderDetails - Order:', JSON.stringify(order.toJSON(), null, 2));

      return res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      console.error('getOrderDetails - Error:', error);
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

      console.log(`getProductVariants - Product ID: ${id}`);

      if (!id) {
        throw new CustomError('Product ID is required', 400);
      }

      const variants = await Variant.findAll({
        where: { productId: id },
        attributes: ['variantId', 'sku', 'stock', 'price', 'image', 'options'],
      });

      console.log(`getProductVariants - Found ${variants.length} variants`);

      return res.status(200).json({
        success: true,
        data: variants,
      });
    } catch (error) {
      console.error('getProductVariants - Error:', error);
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

      console.log('createOrder - Request payload:', JSON.stringify(req.body, null, 2));

      if (!customerId || !products || !Array.isArray(products) || products.length === 0 || !total || !paymentMethod) {
        throw new CustomError('Missing required fields', 400);
      }

      const customer = await Customer.findOne({ where: { customerId, isActive: true }, transaction });
      if (!customer) {
        throw new CustomError('Customer not found or inactive', 404);
      }

      console.log(`createOrder - Customer found: ${customerId}`);

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

        console.log(`createOrder - Reducing stock for variant ${variant.sku}: ${variant.stock} - ${product.quantity}`);
        await variant.update({ stock: variant.stock - product.quantity }, { transaction });
        console.log(`createOrder - New stock for variant ${variant.sku}: ${variant.stock - product.quantity}`);
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

      console.log('createOrder - Created order:', JSON.stringify(order.toJSON(), null));

      await transaction.commit();

      return res.status(201).json({
        success: true,
        data: order,
      });
    } catch (error) {
      await transaction.rollback();
      console.error('createOrder - Error:', error);
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      next(new Error(`Failed to create order: ${error.message}`));
    }
  },

  async updateOrder(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { id } = req.params;
      const { products, total, status, paymentMethod, shippingMethod, orderNotes } = req.body;

      console.log('updateOrder - Request payload:', JSON.stringify(req.body, null, 2));

      if (!id) {
        throw new Error('Order ID is required');
      }

      const order = await Order.findOne({
        where: { orderId: id },
        attributes: ['orderId', 'customerId', 'products', 'total', 'status', 'paymentMethod', 'shippingMethod', 'orderNotes', 'createdAt', 'updatedAt'],
        transaction,
      });
      if (!order) {
        throw new Error('Order not found');
      }

      console.log('updateOrder - Fetched order:', JSON.stringify(order.toJSON(), null, 2));

      let updateStatus = order.status;
      if (status) {
        const validStatuses = ['Processing', 'Pending Payment', 'On Hold', 'Shipped', 'Ready to Ship', 'Cancelled'];
        if (!validStatuses.includes(status)) {
          throw new Error('Invalid status');
        }
        updateStatus = status;
      } else if (!updateStatus || updateStatus === '') {
        updateStatus = 'Pending Payment';
      }

      let updatePaymentMethod = order.paymentMethod;
      if (paymentMethod) {
        const validPaymentMethods = ['online_payment', 'cod', 'direct_bank_transfer'];
        if (!validPaymentMethods.includes(paymentMethod)) {
          throw new Error('Invalid payment method');
        }
        updatePaymentMethod = paymentMethod;
      } else if (!updatePaymentMethod || updatePaymentMethod === '') {
        updatePaymentMethod = 'online_payment';
      }

      if (products) {
        if (!Array.isArray(products) || products.length === 0) {
          throw new Error('Invalid product details');
        }

        let existingProducts = [];
        if (Array.isArray(order.products)) {
          existingProducts = order.products;
        } else if (typeof order.products === 'string') {
          try {
            existingProducts = JSON.parse(order.products);
          } catch (err) {
            console.error('updateOrder - Failed to parse existing products:', err);
            throw new Error('Invalid existing product data');
          }
        }
        console.log('updateOrder - Parsed existing products:', JSON.stringify(existingProducts, null, 2));

        const adjustedProducts = new Set();

        for (const existing of existingProducts) {
          const newProduct = products.find(p => p.productId === existing.productId && p.variantId === existing.variantId);
          console.log(`updateOrder - Processing existing product: ${JSON.stringify(existing)}`);
          if (!newProduct) {
            if (existing.variantId) {
              const variant = await Variant.findOne({
                where: { variantId: existing.variantId },
                transaction,
              });
              if (variant) {
                console.log(`updateOrder - Restoring stock for removed variant ${variant.sku}: +${existing.quantity}`);
                await variant.update({ stock: variant.stock + existing.quantity }, { transaction });
                console.log(`updateOrder - New stock for variant ${variant.sku}: ${variant.stock + existing.quantity}`);
              } else {
                console.warn(`updateOrder - Variant ${existing.variantId} not found for stock restoration`);
              }
            }
          } else if (newProduct.quantity !== existing.quantity) {
            const variant = await Variant.findOne({
              where: { variantId: existing.variantId },
              transaction,
            });
            if (variant) {
              const quantityDiff = existing.quantity - newProduct.quantity;
              console.log(`updateOrder - Adjusting stock for variant ${variant.sku}: +${quantityDiff}`);
              await variant.update({ stock: variant.stock + quantityDiff }, { transaction });
              console.log(`updateOrder - New stock for variant ${variant.sku}: ${variant.stock + quantityDiff}`);
              adjustedProducts.add(`${newProduct.productId}:${newProduct.variantId}`);
            } else {
              console.warn(`updateOrder - Variant ${existing.variantId} not found for quantity adjustment`);
            }
          }
        }

        for (const product of products) {
          if (!product.productId || !product.variantId || !product.quantity || product.quantity <= 0) {
            throw new Error('Invalid product or variant details: productId, variantId, and quantity are required');
          }
          if (product.discount && (typeof product.discount !== 'number' || product.discount < 0 || product.discount > 100)) {
            throw new Error('Discount must be a number between 0 and 100');
          }

          const existingProduct = existingProducts.find(p => p.productId === product.productId && p.variantId === product.variantId);
          console.log(`updateOrder - Existing product for ${product.variantId}: ${JSON.stringify(existingProduct)}`);

          const isNewOrChanged = !existingProduct ||
            existingProduct.quantity !== product.quantity ||
            Number(existingProduct.discount) !== Number(product.discount);
          console.log(`updateOrder - Product ${product.variantId} isNewOrChanged: ${isNewOrChanged}`);

          if (isNewOrChanged) {
            const variant = await Variant.findOne({
              where: { variantId: product.variantId, productId: product.productId },
              transaction,
            });
            if (!variant) {
              throw new Error(`Variant ${product.variantId} not found for product ${product.productId}`);
            }

            if (!adjustedProducts.has(`${product.productId}:${product.variantId}`)) {
              const requiredStock = existingProduct ? product.quantity - existingProduct.quantity : product.quantity;
              console.log(`updateOrder - Variant ${variant.sku} - Required stock: ${requiredStock}, Available: ${variant.stock}`);

              if (variant.stock < requiredStock) {
                throw new Error(`Insufficient stock for variant ${variant.sku} (Available: ${variant.stock})`);
              }

              if (requiredStock !== 0) {
                console.log(`updateOrder - Updating stock for variant ${variant.sku}: ${-requiredStock}`);
                await variant.update({ stock: variant.stock - requiredStock }, { transaction });
                console.log(`updateOrder - New stock for variant ${variant.sku}: ${variant.stock - requiredStock}`);
              }
            } else {
              console.log(`updateOrder - Skipping stock update for variant ${variant.sku} (already adjusted)`);
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
      console.log('updateOrder - Update data:', JSON.stringify(updateData, null, 2));

      try {
        await order.update(updateData, { transaction, validate: true });
      } catch (validationError) {
        console.error('updateOrder - Validation error:', validationError);
        throw new Error(`Failed to update order due to validation: ${validationError.message}`);
      }

      const updatedOrder = await Order.findOne({
        where: { orderId: id },
        attributes: ['orderId', 'customerId', 'products', 'total', 'status', 'paymentMethod', 'shippingMethod', 'orderNotes', 'createdAt', 'updatedAt'],
        transaction,
      });
      console.log('updateOrder - Verified updated order:', JSON.stringify(updatedOrder.toJSON(), null, 2));

      await transaction.commit();

      return res.status(200).json({
        success: true,
        data: updatedOrder,
      });
    } catch (error) {
      await transaction.rollback();
      console.error('updateOrder - Error:', error);
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      next(new Error(`Failed to update order: ${error.message}`));
    }
  },

  async bulkUpdateStatus(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { orderIds, status } = req.body;

      console.log(`bulkUpdateStatus - Request: orderIds=${orderIds.join(', ')}, status=${status}`);

      if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
        throw new Error('Order IDs are required and must be an array');
      }

      const validStatuses = ['Processing', 'Pending Payment', 'On Hold', 'Shipped', 'Ready to Ship', 'Cancelled'];
      if (!validStatuses.includes(status)) {
        throw new Error('Invalid status');
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

      console.log(`bulkUpdateStatus - Found ${orders.length} orders`);

      if (orders.length !== orderIds.length) {
        const missingIds = orderIds.filter(id => !orders.find(o => o.orderId === id));
        throw new Error(`Orders not found: ${missingIds.join(', ')}`);
      }

      // Update status in DB
      for (const order of orders) {
        console.log(`bulkUpdateStatus - Updating order ${order.orderId} to status ${status}`);
        await order.update({ status, updatedAt: new Date() }, { transaction });
      }

      // Send emails using sendOrderDetailsEmail
      const emailPromises = orders.map(async (order) => {
        try {
          await sendOrderDetailsEmail(order);
          console.log(`bulkUpdateStatus - Email sent for order ${order.orderId}`);
        } catch (err) {
          console.error(`bulkUpdateStatus - Failed to send email for order ${order.orderId}:`, err.message);
        }
      });

      await Promise.all(emailPromises);
      await transaction.commit();

      console.log(`bulkUpdateStatus - Updated ${orders.length} orders to status ${status}`);

      res.status(200).json({
        success: true,
        message: `Updated status to ${status} for ${orders.length} orders`,
      });
    } catch (error) {
      await transaction.rollback();
      console.error('bulkUpdateStatus - Error:', error);
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      next(new Error(`Failed to update orders: ${error.message}`));
    }
  },

  async cancelOrder(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { id } = req.params;

      console.log(`cancelOrder - Attempting to cancel order ID: ${id}`);

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
        transaction,
      });

      if (!order) {
        console.log(`cancelOrder - Order ${id} not found`);
        throw new CustomError('Order not found', 404);
      }

      console.log(`cancelOrder - Found order: ${JSON.stringify(order.toJSON(), null, 2)}`);

      if (order.status === 'Cancelled') {
        console.log(`cancelOrder - Order ${id} is already cancelled`);
        throw new CustomError('Order is already cancelled', 400);
      }

      let products = [];
      if (Array.isArray(order.products)) {
        products = order.products;
      } else if (typeof order.products === 'string') {
        try {
          products = JSON.parse(order.products);
          console.log(`cancelOrder - Parsed products: ${JSON.stringify(products, null, 2)}`);
        } catch (err) {
          console.error(`cancelOrder - Failed to parse products for order ${id}:`, err);
          throw new CustomError('Invalid product data in order', 500);
        }
      } else {
        console.warn(`cancelOrder - No valid products found for order ${id}`);
      }

      for (const product of products) {
        console.log(`cancelOrder - Processing product: ${JSON.stringify(product, null, 2)}`);
        if (product.variantId && product.quantity && product.quantity > 0) {
          const variant = await Variant.findOne({
            where: { variantId: product.variantId },
            transaction,
          });
          if (variant) {
            const currentStock = variant.stock;
            const quantityToRestore = product.quantity;
            console.log(`cancelOrder - Restoring stock for variant ${variant.sku} (variantId: ${variant.variantId}): Current stock=${currentStock}, Restoring=${quantityToRestore}`);
            await variant.update(
              { stock: currentStock + quantityToRestore },
              { transaction }
            );
            console.log(`cancelOrder - Updated stock for variant ${variant.sku}: New stock=${currentStock + quantityToRestore}`);
          } else {
            console.warn(`cancelOrder - Variant ${product.variantId} not found for order ${id}`);
          }
        
        } else {
          console.warn(`cancelOrder - Skipping product with invalid variantId or quantity: ${JSON.stringify(product)}`);
        }
      }

      console.log(`cancelOrder - Updating order ${id} status to 'Cancelled'`);
      await order.update({ status: 'Cancelled', updatedAt: new Date() }, { transaction });

      // Send cancellation email to customer
      try {
        await sendOrderDetailsEmail(order);
        console.log(`cancelOrder - Cancellation email sent for order ${order.orderId}`);
      } catch (emailError) {
        console.error(`cancelOrder - Failed to send cancellation email for order ${order.orderId}:`, emailError.message);
        // Note: We don't throw an error here to prevent transaction rollback
      }

      await transaction.commit();

      console.log(`cancelOrder - Order ${id} cancelled successfully`);

      return res.status(200).json({
        success: true,
        message: 'Order cancelled successfully',
      });
    } catch (error) {
      await transaction.rollback();
      console.error(`cancelOrder - Error for order ${id}:`, error);
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