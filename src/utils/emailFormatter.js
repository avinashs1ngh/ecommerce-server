const { Variant, Product } = require('../models');

async function formatOrderUpdateEmail({ senderEmail, receiverEmail, customerName, orderDetails }) {
  const { orderId, status, total, paymentMethod, customer, products } = orderDetails;

 
  const s = customer?.shippingAddress || {};
  const shippingAddress = [s.street, s.building, s.landmark, s.city, s.state, s.pincode]
    .filter(Boolean)
    .join(', ')
    .replace(/ ,/g, '')
    || 'N/A';

 
  let subtotal = 0, shippingCharge = 0, gst = 0, onlinePaymentFee = 0, totalWeight = 0;
  let productRows = '';

  try {
    const list = typeof products === 'string' ? JSON.parse(products) : products;

    const detailRows = await Promise.all(
      list.map(async (p, i) => {
        const variant  = await Variant.findOne({ where: { variantId: p.variantId, productId: p.productId }, attributes: ['price','options'] });
        const prodInfo = await Product.findOne({ where: { productId: p.productId }, attributes: ['productName','weight'] });

       
        const priceVal = parseFloat(variant?.price ?? 0) || 0;
        const discPct  = p.discount || 0;
        const itemTot  = (priceVal - priceVal * discPct / 100) * p.quantity;
        subtotal += itemTot;

       
        const w = parseFloat(prodInfo?.weight ?? 0);
        totalWeight += (w / 1000) * p.quantity;

       
        let opts = 'N/A';
        if (variant?.options) {
          try {
            const arr = typeof variant.options === 'string' ? JSON.parse(variant.options) : variant.options;
            if (Array.isArray(arr) && arr.length) opts = arr.map(o=>`${o.attribute}: ${o.value}`).join(', ');
          } catch (_) {}
        }

        return `
          <tr>
            <td class="cell center">${i+1}</td>
            <td class="cell">${prodInfo?.productName || p.productId}</td>
            <td class="cell right">₹${priceVal.toFixed(2)}</td>
            <td class="cell center">${p.quantity}</td>
            <td class="cell center">${discPct ? discPct+'%' : '—'}</td>
            <td class="cell">${opts}</td>
            <td class="cell right">₹${itemTot.toFixed(2)}</td>
          </tr>`;
      })
    );

    productRows = detailRows.join('');
  } catch (e) {
    console.error('Product parsing error:', e);
    productRows = `<tr><td colspan="7" class="cell">Details unavailable</td></tr>`;
  }

 
  shippingCharge = totalWeight <= 1 ? 100 :
                   totalWeight <= 2 ? 200 :
                   totalWeight <= 5 ? 300 :
                   totalWeight <=10 ? 400 : 'Contact to transport';

  gst = subtotal * 0.10;
  if (paymentMethod === 'online_payment') onlinePaymentFee = subtotal * 0.02;

  const shipTxt  = typeof shippingCharge === 'number' ? `₹${shippingCharge.toFixed(2)}` : shippingCharge;
  const weightKg = totalWeight.toFixed(2);
  const payLbl   = paymentMethod.replace('_',' ').toUpperCase();

 
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Order Update</title>
<style>
  body     { margin:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;color:#333; }
  .wrap    { width:100%;padding:20px 0; }
  .card    { width:600px;margin:auto;background:#fff;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,.1);overflow:hidden; }
  .header  { background:#003f4f;color:#fff;text-align:center;padding:24px 20px;font-size:24px;font-weight:700; }
  .section { padding:24px 32px; }
  h3       { margin:0 0 12px;font-size:18px;color:#333;font-weight:600; }
  p        { margin:0 0 12px;font-size:14px;line-height:1.45; }
  table.meta   { width:100%;border-collapse:collapse;background:#fafafa;border-radius:6px;overflow:hidden; }
  table.meta tr:nth-child(even){background:#f0f0f0;}
  table.meta td{ padding:10px;font-size:14px;color:#555; }
  .items   { width:100%;border-collapse:collapse;background:#fafafa;border-radius:6px;overflow:hidden;}
  .items th{ background:#ececec;padding:8px;font-size:13px;text-align:left;color:#333;}
  .cell    { padding:8px;font-size:13px;border-bottom:1px solid #ddd;color:#555; }
  .center  { text-align:center; }
  .right   { text-align:right; }
  .summary { width:100%;border-collapse:collapse;background:#fafafa;border-radius:6px;overflow:hidden; }
  .summary tr:nth-child(even){background:#f0f0f0;}
  .summary td{ padding:10px 8px;font-size:14px;color:#555; }
  .summary .total td{ border-top:1px solid #ddd;font-weight:700;font-size:16px;color:#333; }
  .btn     { display:inline-block;margin-top:16px;background:#003f4f;color:#fff;text-decoration:none;padding:10px 20px;border-radius:4px;font-size:14px; }
  .foot    { background:#f5f5f5;text-align:center;padding:14px;font-size:11px;color:#666; }
</style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="header">Order Update</div>

      <div class="section">
        <p>Hello ${customerName || 'Customer'},</p>
        <p>Your order (<strong>${orderId}</strong>) status is now <strong>${status}</strong>.</p>

        <!-- META -->
        <table class="meta">
          <tr><td><b>Order&nbsp;ID:</b></td><td>${orderId}</td></tr>
          <tr><td><b>Status:</b></td><td>${status}</td></tr>
          <tr><td><b>Payment:</b></td><td>${payLbl}</td></tr>
          <tr><td><b>Ship&nbsp;to:</b></td><td>${shippingAddress}</td></tr>
        </table>
      </div>

      <!-- ITEMS -->
      <div class="section">
        <h3>Items</h3>
        <table class="items">
          <thead>
            <tr><th>#</th><th>Product</th><th>Price</th><th>Qty</th><th>Disc.</th><th>Options</th><th style="text-align:right;">Total</th></tr>
          </thead>
          <tbody>${productRows}</tbody>
        </table>
      </div>

      <!-- SUMMARY -->
      <div class="section">
        <h3>Charge Summary</h3>
        <table class="summary">
          <tr><td>Subtotal</td><td class="right">₹${subtotal.toFixed(2)}</td></tr>
          <tr><td>Total Weight</td><td class="right">${weightKg} kg</td></tr>
          <tr><td>Shipping</td><td class="right">${shipTxt}</td></tr>
          <tr><td>GST&nbsp;(10%)</td><td class="right">₹${gst.toFixed(2)}</td></tr>
          ${paymentMethod === 'online_payment' ? `
          <tr><td>Online Payment Fee&nbsp;(2%)</td><td class="right">₹${onlinePaymentFee.toFixed(2)}</td></tr>` : ''}
          <tr class="total"><td>Total Payable</td><td class="right">₹${total.toFixed(2)}</td></tr>
        </table>
        <p style="font-size:12px;color:#777;">* Total includes taxes, shipping (based on ${weightKg} kg) and any payment fees.</p>
        <a href="mailto:${senderEmail}" class="btn">Contact Support</a>
      </div>

      <!-- FOOTER -->
      <div class="foot">
        Sent from: ${senderEmail} &nbsp;|&nbsp; To: ${receiverEmail}<br/>
        © ${new Date().getFullYear()} SiliconLeaf
      </div>
    </div>
  </div>
</body>
</html>`;
}

module.exports = { formatOrderUpdateEmail };
