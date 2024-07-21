import nodemailer from 'nodemailer';
export const sendEmail = async (email,invoicePath,order) => {
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
        const info = await transporter.sendMail({
            from: '"DIGITAL DELIGHTS"<digital.delight@gmail.com>',
            to: email,
            subject: `Order Confirmation - ${order._id}`,
            html: `Thank you for your order. Your order ID is ${order._id}.`,
            attachments: [
                {
                  filename: 'invoice.pdf',
                  path: invoicePath,
                },
              ],
        })
        
    } catch (error) {
        throw new error("Error sending welcome email", error.message);
    }
}
