export const registrationEmailTemplate = (username) => `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #333;">Welcome to Our Website, ${username}!</h2>
        <p>Thank you for registering on our website. We're excited to have you on board!</p>
        <p>If you have any questions or need support, feel free to contact us.</p>
        <p>Best regards,</p>
        <p>The Team</p>
    </div>
`;

export const loginEmailTemplate = (username) => `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #333;">Login Notification</h2>
        <p>Hi ${username},</p>
        <p>We noticed a new login to your account. If this was you, you can safely ignore this email.</p>
        <p>If you did not log in, please contact our support team immediately.</p>
        <p>Best regards,</p>
        <p>The Team</p>
    </div>
`;

export const forgotPasswordContent = (firstname, otp) => `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hi ${firstname},</p>
        <p>Your OTP for password reset is: <strong>${otp}</strong></p>
        <p>This OTP is valid for 15 minutes.</p>
        <p>Best regards,</p>
        <p>The Team</p>
      </div>
    `;

export const OrderPlacedContent = (firstname) => `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>Hi ${firstname},</p>
      <p>Thank you for your order! We’ll let you know as soon as it ships.While you’re waiting,</p>
      <p>check out this post on how to use it.Or spread the word! Click here to share your order </p>
      <p>on social media.</p>
      <p>Best Regards</p>
      <p>The Team</p>
    </div>
  `;

function getOrderStatusMessage(order_status) {
  switch (order_status) {
    case 'processing':
      return '<li><strong>Processing:</strong> Your order has been received and is being prepared.</li>';
    case 'shipped':
      return '<li><strong>Dispatching:</strong> Your order is on its way to our courier partner.</li>';
    case 'delivered':
      return '<li><strong>Delivered:</strong> Your order has been delivered to the provided address.</li>';
    case 'cancelled':
      return '<li><strong>Cancelled:</strong> Your order has been cancelled. Please contact us if you have any questions or need further assistance.</li>';
    default:
      return '<li><strong>Unknown:</strong> The status of your order is unknown. Please contact customer support for more information.</li>';
  }
}

export const TrackOrderContent = (username, status, order_number, order_date, items) => {
  let message = getOrderStatusMessage(status)

  const formattedDate = new Date(order_date).toLocaleDateString();
  const itemsTable = `
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px;">Product Name</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(item => `
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${item.price}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2 style="color: #333;">Order Status Update</h2>
    <p>Hi ${username},</p>
    <p>Thank you for shopping with us at DIGITAL DELIGHTS! We wanted to provide you with an update on your order <strong>#${order_number}</strong>.</p>
    <p><strong>Order Details:</strong></p>
    <p>Order Number: ${order_number}</p>
    <p>Order Date: ${formattedDate}</p>
   
    <p>Items Ordered: ${itemsTable}</p>
   
    <p class="status"><strong>Current Status:</strong> ${status} - ${message}</p>
    <p><strong>Status Definitions:</strong></p>
   <ul>
        ${message}
    </ul>
    <p><strong>Tracking Information:</strong></p>
    <p>If you have any questions or need further assistance, please do not hesitate to contact our customer service team at <strong>mayankjain12feb@gmail.com</strong> or call us at <strong>+918826250203</strong>.</p>
    <p>Thank you for choosing DIGITAL DELIGHT. We appreciate your business and look forward to serving you again!</p>
    <p>Best Regards,</p>
    <p>MAYANK JAIN</p>
    <p>DIGITAL DELIGHTS</p>
    <p>www.digitaldelights.com</p>
    <p>mayankjain12feb@gmail.com</p>
    <p>+918826250203</p>
</div>
`
}

export const getRejectEmailContent = (orderId, reason) => {
  `<p>Dear Customer,</p>
  <p>We regret to inform you that your return/replace request for order <strong>#${orderId}</strong> has been rejected.</p>
  <p><strong>Reason:</strong> ${reason}</p>
  <p>If you have any questions or need further assistance, please contact our support team.</p>
  <p>Thank you for your understanding.</p>
  <p>Best regards,<br>[Your Company Name]</p>`
};

export const getAcceptReturnEmailContent = (orderId, productName, variant) => {
  `<p>Dear Customer,</p>
<p>We are pleased to inform you that your return request for order <strong>#${orderId}</strong> has been approved.</p>
<p><strong>Product:</strong> ${productName}<br><strong>Variant:</strong> ${variant}</p>
<p>Please follow the return instructions provided in the original packaging or contact our support team for further assistance.</p>
<p>Thank you for shopping with us.</p>
<p>Best regards,<br>[Your Company Name]</p>`
};

export const getAcceptReplaceEmailContent = (orderId, productName, oldVariant, newVariant) => {
  
     `<p>Dear Customer,</p>
<p>We are pleased to inform you that your replacement request for order <strong>#${orderId}</strong> has been approved.</p>
<p><strong>Product:</strong> ${productName}<br><strong>From:</strong> ${oldVariant}<br><strong>To:</strong> ${newVariant}</p>
<p>Please follow the replacement instructions provided in the original packaging or contact our support team for further assistance.</p>
<p>Thank you for shopping with us.</p>
<p>Best regards,<br>[Your Company Name]</p>`
  
};





