import nodemailer from 'nodemailer';
import { otpGeneratorAndUpdate } from './otpGenerator.js';
import { forgotPasswordContent, loginEmailTemplate, OrderPlacedContent, registrationEmailTemplate } from './emailContent.js';
export const sendEmail = async (to, subject, text, html, attachments) => {
  console.log(to)
  console.log(subject)
  console.log(text)
  console.log(html)
  console.log(attachments)
  console.log(typeof(attachments))
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
        html: OrderPlacedContent(data.user.firstname),
      };
    case 'trackOrder':
      return {
        subject: `Order Tracking - ${data.orderId}`,
        text: `Hello ${data.name}, you can track your order ${data.orderId} here: ${data.trackingLink}.`,
        html: `<p>Hello <strong>${data.name}</strong>, you can track your order <strong>${data.orderId}</strong> <a href="">here</a>.</p>`,
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