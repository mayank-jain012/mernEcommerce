import nodemailer from 'nodemailer';
import { otpGeneratorAndUpdate } from './otpGenerator.js';
import { forgotPasswordContent, loginEmailTemplate, OrderPlacedContent, registrationEmailTemplate,TrackOrderContent } from './emailContent.js';
export const sendEmail = async (to, subject, text, html, attachments) => {
  // console.log(to)
  console.log(subject)
  console.log(text)
  console.log(html)
 
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
    }else{
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
  console.log(data);  
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
        html: TrackOrderContent(data.order.user.firstname,data.order.status,data.order._id,data.order.createdAt,data.order.orderItems),
      };
    case 'coupon':
      return {
        subject: 'Your Coupon Code',
        text: `Hello ${data.name}, use the coupon code ${data.couponCode} to get a discount.`,
        html: `<p>Hello <strong>${data.name}</strong>, use the coupon code <strong>${data.couponCode}</strong> to get a discount.</p>`,
      };
    default:
      return {};
  }
}