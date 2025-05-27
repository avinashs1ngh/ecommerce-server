const { Variant, Product } = require('../models'); // Adjust path to your models

async function formatOrderUpdateEmail({ senderEmail, receiverEmail, customerName, orderDetails }) {
  const { orderId, status, total, paymentMethod, customer, products } = orderDetails;
  const shippingAddress = customer?.shippingAddress
    ? `${customer.shippingAddress.street || ''}, ${customer.shippingAddress.building || ''}, ${customer.shippingAddress.landmark || ''}, ${customer.shippingAddress.city || ''}, ${customer.shippingAddress.state || ''} ${customer.shippingAddress.pincode || ''}`.trim()
    : 'N/A';

  let productRows = '';
  try {
    const productList = typeof products === 'string' ? JSON.parse(products) : products;
    console.log('Product List:', JSON.stringify(productList, null, 2));

    const productDetails = await Promise.all(
      productList.map(async (product, index) => {
        const variant = await Variant.findOne({
          where: { variantId: product.variantId, productId: product.productId },
          attributes: ['variantId', 'sku', 'price', 'options'],
        });

        const productData = await Product.findOne({
          where: { productId: product.productId },
          attributes: ['productName'],
        });

        if (!variant) {
          console.error(`Variant not found for productId: ${product.productId}, variantId: ${product.variantId}`);
        } else {
          console.log(`Variant found:`, {
            variantId: variant.variantId,
            productId: product.productId,
            price: variant.price,
            priceType: typeof variant.price,
          });
        }

        // Parse price as a number
        let price = 'N/A';
        if (variant && variant.price != null) {
          price = parseFloat(variant.price);
          if (isNaN(price)) {
            console.warn(`Invalid price for variant ${product.variantId}: ${variant.price}`);
            price = 'N/A';
          }
        }

        // Format options as human-readable
        let optionsText = 'N/A';
        if (variant && variant.options) {
          try {
            const options = typeof variant.options === 'string' ? JSON.parse(variant.options) : variant.options;
            if (Array.isArray(options)) {
              optionsText = options
                .map(opt => `${opt.attribute}: ${opt.value}`)
                .join(', ');
            }
          } catch (e) {
            console.warn(`Failed to parse options for variant ${product.variantId}:`, e.message);
          }
        }

        return {
          index: index + 1,
          productName: productData ? productData.productName : 'Unknown Product',
          price,
          quantity: product.quantity || 'N/A',
          discount: product.discount ? `${product.discount}%` : 'N/A',
          options: optionsText,
        };
      })
    );

    productRows = productDetails
      .map(
        (item) => `
          <tr>
            <td style="color: #555555; font-size: 14px; padding: 8px; border-bottom: 1px solid #ddd;">${item.index}</td>
            <td style="color: #555555; font-size: 14px; padding: 8px; border-bottom: 1px solid #ddd;">${item.productName}</td>
            <td style="color: #555555; font-size: 14px; padding: 8px; border-bottom: 1px solid #ddd;">${typeof item.price === 'number' ? `₹${item.price.toFixed(2)}` : item.price}</td>
            <td style="color: #555555; font-size: 14px; padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
            <td style="color: #555555; font-size: 14px; padding: 8px; border-bottom: 1px solid #ddd;">${item.discount}</td>
            <td style="color: #555555; font-size: 14px; padding: 8px; border-bottom: 1px solid #ddd;">${item.options}</td>
          </tr>
        `
      )
      .join('');
  } catch (error) {
    console.error('Error parsing products or fetching variants/products:', error.message);
    productRows = '<tr><td colspan="6" style="color: #555555; font-size: 14px; padding: 8px;">No product details available</td></tr>';
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Update</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
          <td align="center">
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <tr>
                <td style="background-color: #003f4f; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                  <h2 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">Order Update</h2>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px 30px;">
                  <p style="color: #333333; font-size: 16px; margin: 0 0 10px;">Dear ${customerName || 'Customer'},</p>
                  <p style="color: #333333; font-size: 14px; margin: 0 0 15px;">
                    Your order (ID: ${orderId}) has been updated to <strong>${status}</strong>.<br>
                     Below are the details:
                  </p>
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f9f9f9; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
                    <tr>
                      <td style="color: #555555; font-size: 14px; padding: 5px;"><strong>Order ID:</strong> ${orderId}</td>
                    </tr>
                    <tr>
                      <td style="color: #555555; font-size: 14px; padding: 5px;"><strong>Status:</strong> ${status}</td>
                    </tr>
                    <tr>
                      <td style="color: #555555; font-size: 14px; padding: 5px;"><strong>Total:</strong> ₹${total.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style="color: #555555; font-size: 14px; padding: 5px;"><strong>Payment Method:</strong> ${paymentMethod || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td style="color: #555555; font-size: 14px; padding: 5px;"><strong>Shipping Address:</strong> ${shippingAddress}</td>
                    </tr>
                  </table>
                  <h3 style="color: #333333; font-size: 18px; margin: 0 0 10px;">Order Items</h3>
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f9f9f9; padding: 10px; border-radius: 5px; margin-bottom: 15px;">
                    <thead>
                      <tr>
                        <th style="color: #333333; font-size: 14px; padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">#</th>
                        <th style="color: #333333; font-size: 14px; padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">Product</th>
                        <th style="color: #333333; font-size: 14px; padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">Price</th>
                        <th style="color: #333333; font-size: 14px; padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">Quantity</th>
                        <th style="color: #333333; font-size: 14px; padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">Discount</th>
                        <th style="color: #333333; font-size: 14px; padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">Options</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${productRows}
                    </tbody>
                  </table>
                  <p style="color: #333333; font-size: 14px; margin: 0 0 15px;">
                    For any queries, please contact us at <a href="mailto:${senderEmail}" style="color: #003f4f; text-decoration: none;">${senderEmail}</a>.
                  </p>
                  <a href="mailto:${senderEmail}" style="display: inline-block; background-color: #003f4f; color: #ffffff; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-size: 14px;">Contact Support</a>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f5f5f5; padding: 15px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                  <p style="color: #666666; font-size: 12px; margin: 0;">Sent from: ${senderEmail}</p>
                  <p style="color: #666666; font-size: 12px; margin: 0;">To: ${receiverEmail}</p>
                  <p style="color: #666666; font-size: 12px; margin: 10px 0 0;">© ${new Date().getFullYear()} SiliconLeaf. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

module.exports = { formatOrderUpdateEmail };