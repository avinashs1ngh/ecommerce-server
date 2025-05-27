const { sendEmail } = require('./emailService'); // Adjust path
const { formatOrderUpdateEmail, formatOrderCreatedEmail } = require('./emailFormatter'); // Adjust path

// Utility function to format payment method
const formatPaymentMethod = (method) => {
  switch (method) {
    case 'online_payment':
      return 'Online Payment';
    case 'cod':
      return 'Cash on Delivery';
    case 'direct_bank_transfer':
      return 'Direct Bank Transfer';
    default:
      return method || 'N/A'; // Fallback for undefined/null
  }
};

async function sendOrderDetailsEmail(order) {
  try {
    if (!order || !order.orderId) {
      throw new Error('Invalid order data: orderId is required');
    }

    const receiverEmail = order.customer?.email || 'fasat61070@dlbazi.com';
    const customerName = `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim() || 'Customer';

    const htmlContent = await formatOrderUpdateEmail({
      senderEmail: process.env.SENDER_EMAIL,
      receiverEmail,
      customerName,
      orderDetails: {
        orderId: order.orderId,
        status: order.status || 'Pending',
        total: order.total || 0,
        paymentMethod: formatPaymentMethod(order.paymentMethod),
        customer: {
          shippingAddress: order.customer?.shippingAddress || {},
        },
        products: order.products || [], // Ensure products is always defined
      },
    });

    await sendEmail({
      senderEmail: process.env.SENDER_EMAIL,
      receiverEmail,
      subject: `Order Details: ${order.orderId}`,
      htmlContent,
    });

    console.log(`Email sent to ${receiverEmail} for order ${order.orderId}`);
    return { success: true, message: `Email sent for order ${order.orderId}` };
  } catch (error) {
    console.error(`Failed to send email for order ${order.orderId || 'unknown'}:`, error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}
// async function sendOrderCreatedEmail(order) {
//      if (!order || !order.orderId) {
//       throw new Error('Invalid order data: orderId is required');
//     }

//   const receiverEmail = order.customer.email;
//   const customerName = `${order.customer.firstName} ${order.customer.lastName}`.trim() || 'Customer';

//   const html = await formatOrderCreatedEmail({
//     senderEmail: process.env.SENDER_EMAIL,
//     receiverEmail,
//     customerName,
//    orderDetails: {
//         orderId: order.orderId,
//         status: order.status || 'Pending',
//         total: order.total || 0,
//         paymentMethod: formatPaymentMethod(order.paymentMethod),
//         customer: {
//           shippingAddress: order.customer?.shippingAddress || {},
//         },
//         products: order.products || [], 
//       },
//   });

//   await sendEmail({
//     senderEmail: process.env.SENDER_EMAIL,
//     receiverEmail,
//     subject: `Order Confirmation: ${order.orderId}`,
//     htmlContent: html,
//   });
// }
module.exports = { sendOrderDetailsEmail };