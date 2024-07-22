import fs from 'fs';
import PDFDocument from 'pdfkit';
import { User } from '../model/userSchema.js';
import { Color } from '../model/colorModel.js';
import { Size } from '../model/sizeSchema.js';
import path from 'path';

export const generateInvoice = async (order) => {
  // Fetch user details from the database
  const user = await User.findById(order.user).lean().exec();
  if (!user) {
    throw new Error('User not found');
  }

  // Ensure the invoices directory exists
  const __dirname = "./invoices/"
  const invoiceDir = path.join(__dirname, 'invoices');
  if (!fs.existsSync(invoiceDir)) {
    fs.mkdirSync(invoiceDir, { recursive: true });
  }

  const doc = new PDFDocument({ margin: 50 });
  const invoicePath = path.join(invoiceDir, `${order._id}.pdf`);
  doc.pipe(fs.createWriteStream(invoicePath));

  // Company Details
  doc.fontSize(16).text('DIGITAL DELIGHTS', { align: 'center' });
  doc.fontSize(12).text('BUDH VIHAR PHASE-1, DELHI', { align: 'center' });
  doc.text('Phone: +91 8826250203', { align: 'center' });
  doc.text('GST Number: 1234567890', { align: 'center' });
  doc.moveDown(2);

  // Invoice Details
  doc.fontSize(14).text(`Order Invoice - ${order._id}`, { align: 'center' });
  doc.fontSize(12).text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
  doc.text(`Customer: ${user.firstname} ${user.lastname}`);
  doc.text(`Email: ${user.email}`);
  doc.moveDown(1);

  // Table Header
  const tableTop = doc.y;
  const itemTable = {
    column1: 50,
    column2: 200,
    column3: 300,
    column4: 400
  };

  doc.fontSize(12).text('Item', itemTable.column1, tableTop);
  doc.text('Size', itemTable.column2, tableTop);
  doc.text('Color', itemTable.column3, tableTop);
  doc.text('Price', itemTable.column4, tableTop);

  // Draw table header underline
  doc.moveTo(itemTable.column1, tableTop + 15)
     .lineTo(500, tableTop + 15)
     .stroke();

  // Draw table rows
  doc.moveDown(1);
  for (const item of order.orderItems) {
    try {
      const color = await Color.findById(item.color).lean().exec();
      const size = await Size.findById(item.size).lean().exec();

      doc.text(item.name, itemTable.column1, doc.y);
      doc.text(size.name || 'N/A', itemTable.column2, doc.y);
      doc.text(color.name || 'N/A', itemTable.column3, doc.y);
      doc.text(`${item.quantity} x ${item.price}`, itemTable.column4, doc.y);

      // Draw row separator
      doc.moveTo(itemTable.column1, doc.y + 15)
         .lineTo(500, doc.y + 15)
         .stroke();

      doc.moveDown(0.5);
    } catch (error) {
      console.error(`Error fetching details for item ${item.name}:`, error);
    }
  }

  // Draw totals
  doc.moveDown(1);
  doc.text(`Items Price: ${order.itemsPrice}`, { align: 'right' });
  doc.text(`Tax Price: ${order.taxPrice}`, { align: 'right' });
  doc.text(`Shipping Price: ${order.shippingPrice}`, { align: 'right' });
  doc.text(`Total Price: ${order.totalPrice}`, { align: 'right' });

  doc.end();

  return invoicePath;
};

