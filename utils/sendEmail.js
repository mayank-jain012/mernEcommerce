import nodemailer from 'nodemailer';
import { otpGeneratorAndUpdate } from './otpGenerator.js';
import { forgotPasswordContent, getRejectEmailContent, loginEmailTemplate, OrderPlacedContent, registrationEmailTemplate, TrackOrderContent, getAcceptReplaceEmailContent, getAcceptReturnEmailContent } from './emailContent.js';
export const sendEmail = async (to, subject, text, html, attachments) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: "mayankjain12feb@gmail.com",
        pass: "dyqb tszc somg bwsv"
      }
    });
    if (attachments == undefined) {
      const info = await transporter.sendMail({
        from: '"DIGITAL DELIGHTS"<digital.delight@gmail.com>',
        to,
        subject,
        html,
        text,
      })
    } else {
      const info = await transporter.sendMail({
        from: '"DIGITAL DELIGHTS"<digital.delight@gmail.com>',
        to,
        subject,
        html,
        text,
        attachments
      })
    }
  } catch (error) {
    throw new error("Error sending welcome email", error.message);
  }
}
export const getEmailTemplate = async (type, data) => {

  switch (type) {
    case 'signup':
      return {
        subject: 'Welcome to Our Service',
        text: `Hello ${data?.user.firstname + data?.user.lastname}, welcome to our service!`,
        html: registrationEmailTemplate(data?.user.firstname + data?.user.lastname)
      };
    case 'login':
      return {
        subject: 'Login Alert',
        text: `Hello ${data.findUser.firstname + data.findUser.lastname}, you have successfully logged in.`,
        html: loginEmailTemplate(data.findUser.firstname + data.findUser.lastname)
      };
    case 'forgotPassword':
      const otp = await otpGeneratorAndUpdate(data.exist.email);
      return {
        subject: 'Forgot Password',
        text: `Hello ${data.exist.firstname + data.exist.lastname}, you have successfully logged in.`,
        html: forgotPasswordContent(data.exist.firstname + data.exist.lastname, otp)
      };
    case 'order':
      return {
        subject: `Order Confirmation - ${data.orderId}`,
        text: `Hello ${data.name}, your order ${data.orderId} has been placed successfully.`,
        html: OrderPlacedContent(data.name),
      };
    case 'trackOrder':
      return {
        subject: ` Update on Your Order ${data.order._id} - Current Status: ${data.order.status}`,
        text: `Hello ${data.order.user.firstname}, you can track your order ${data.order._id}.`,
        html: TrackOrderContent(data.order.user.firstname, data.order.status, data.order._id, data.order.createdAt, data.order.orderItems),
      };
    case 'coupon':
      return {
        subject: 'Your Coupon Code',
        text: `Hello ${data.name}, use the coupon code ${data.couponCode} to get a discount.`,
        html: `<p>Hello <strong>${data.name}</strong>, use the coupon code <strong>${data.couponCode}</strong> to get a discount.</p>`,
      };
    case 'rejected':
      return {
        subject: `Return/Replace Request Rejected for Order #${orderId}`,
        text: `Dear Customer,
            We regret to inform you that your return/replace request for order #${orderId} has been rejected. 
            Reason: ${reason}
            If you have any questions or need further assistance, please contact our support team.
            Thank you for your understanding.
            Best regards,
            DIGITAL DELIGHTS
          `,
        html: getRejectEmailContent()
      }
    case 'return':
      return {
        subject: `Return Request Approved for Order #${data.orderId}`,
        text: `Dear Customer,
            We are pleased to inform you that your return request for order #${data.orderId} has been approved.
            Product: ${data.productName}
            Size: ${data.oldSize}
            Color:${data.oldColor}
            Please follow the return instructions provided in the original packaging or contact our support team for further assistance.
            Thank you for shopping with us.
            Best regards,
            DIGITAL DELIGHTS
        `,
        html: getAcceptReturnEmailContent()
      }
    case 'replace':
      return {
        subject: `Replacement Request Approved for Order #${data.orderId}`,
        text: `Dear Customer,
            We are pleased to inform you that your replacement request for order #${data.orderId} has been approved.
            Product: ${data.productName}
            From Size: ${data.oldSize}
            From Color: ${data.oldColor}
            To Size: ${data.newSize}
            To Color: ${data.newColor}
            Please follow the replacement instructions provided in the original packaging 
            or contact our support team for further assistance.
            Thank you for shopping with us.
            Best regards,
            [Your Company Name]
        `,
        html: getAcceptReplaceEmailContent(data.orderId, data.productName, data.oldSize,data.oldColor, data.newColor,data.newSize)
      }
    default:
      return {};
  }
}