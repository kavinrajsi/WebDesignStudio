import { jsPDF } from 'jspdf';

interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  website: string;
}

interface InvoiceData {
  invoiceNumber: string;
  customer: CustomerDetails;
  amount: number;
  gstAmount: number;
  totalAmount: number;
  paymentId: string;
  orderId: string;
  status: 'success' | 'error';
  date: string;
}

interface InvoiceResult {
  invoiceNumber: string;
  pdfBuffer: Buffer;
}

export class InvoiceService {
  public static generateInvoiceNumber(): string {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `INV-${year}${month}${day}-${random}`;
  }

  public static async generatePDF(invoiceData: InvoiceData): Promise<Buffer> {
    const doc = new jsPDF();
    let y = 20;
    const leftX = 20;
    const rightX = 120;

    // BILL FROM
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('BILL FROM:', leftX, y);
    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text('PIXEL BOY MEDIA PUBLICITIES PRIVATE LIMITED', leftX, y); y += 7;
    doc.text('4, Alamelu Manga Puram Rd, Saradapuram, Mylapore', leftX, y); y += 7;
    doc.text('Chennai, TN, 600004', leftX, y); y += 7;
    doc.text('India', leftX, y); y += 10;

    // Horizontal line
    doc.setDrawColor('#888888');
    doc.setLineWidth(0.5);
    doc.line(leftX, y, 190, y);
    y += 10;

    // BILL TO
    doc.setFont('helvetica', 'bold');
    doc.text('BILL TO:', leftX, y);

    doc.setFont('helvetica', 'normal');
    let billToY = y + 8;
    doc.text(invoiceData.customer.name, leftX, billToY); billToY += 7;
    doc.text(invoiceData.customer.website, leftX, billToY); billToY += 7;
    doc.text(invoiceData.customer.phone, leftX, billToY); billToY += 7;
    doc.text(invoiceData.customer.email, leftX, billToY);

    // Invoice summary (right)
    let summaryY = y;
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE #', rightX, summaryY);
    doc.setFont('helvetica', 'normal');
    doc.text(invoiceData.invoiceNumber, rightX + 40, summaryY); summaryY += 7;

    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE DATE', rightX, summaryY);
    doc.setFont('helvetica', 'normal');
    doc.text(invoiceData.date, rightX + 40, summaryY); summaryY += 9;

    // Reset
    doc.setFontSize(11);
    doc.setTextColor('#000000');

    // Move y below both sections
    y = Math.max(billToY, summaryY) + 15;

    // Table header
    doc.setFillColor('#E5E7EB');
    doc.setDrawColor('#888888');
    doc.setLineWidth(0.2);
    doc.rect(leftX, y, 170, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Item', leftX + 2, y + 7);
    doc.text('Description', leftX + 22, y + 7);
    doc.text('Price', leftX + 112, y + 7);
    y += 10;

    // Table row
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setDrawColor('#E5E7EB');
    doc.line(leftX, y, 190, y);
    doc.text('1', leftX + 2, y + 7);
    doc.text('SEO Audit', leftX + 22, y + 7);

    // Description (sub-line)
    doc.setFontSize(9);
    doc.setTextColor('#666666');
    doc.text(invoiceData.customer.website, leftX + 22, y + 12);

    // Price data
    doc.setFontSize(11);
    doc.setTextColor('#000000');
    doc.text('₹870.00', leftX + 112, y + 7);
    y += 17; // add more height for description line
    doc.setDrawColor('#888888');
    doc.line(leftX, y, 190, y);

    // Summary
    y += 10;
    const summaryX = leftX + 100;
    doc.setFont('helvetica', 'bold');
    doc.text('SUBTOTAL', summaryX, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`₹870.00`, summaryX + 60, y, { align: 'right' });

    y += 7;
    doc.setFont('helvetica', 'bold');
    doc.text('TAX (18.0%)', summaryX, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`₹${invoiceData.gstAmount.toFixed(2)}`, summaryX + 60, y, { align: 'right' });

    y += 7;
    doc.setFillColor('#E5E7EB');
    doc.rect(summaryX, y - 6, 80, 9, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL', summaryX, y);
    doc.text(`₹${invoiceData.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, summaryX + 60, y, { align: 'right' });

    // Convert to buffer
    return Buffer.from(doc.output('arraybuffer'));
  }

  public static async generateAndSendInvoice(
    customer: CustomerDetails,
    paymentId: string,
    orderId: string,
    status: 'success' | 'error'
  ): Promise<InvoiceResult> {
    const invoiceNumber = this.generateInvoiceNumber();
    const amount = 870; // Base amount
    const gstAmount = amount * 0.18; // 18% GST
    const totalAmount = amount + gstAmount;

    const invoiceData: InvoiceData = {
      invoiceNumber,
      customer,
      amount,
      gstAmount,
      totalAmount,
      paymentId,
      orderId,
      status,
      date: new Date().toISOString().split('T')[0],
    };

    try {
      const pdfBuffer = await this.generatePDF(invoiceData);
      return {
        invoiceNumber,
        pdfBuffer
      };
    } catch (error) {
      console.error('Error generating invoice:', error);
      throw error;
    }
  }
} 