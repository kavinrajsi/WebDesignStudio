// app/api/send-invoice/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  const body = await request.json();
  const { customer, status } = body; // customer: { name, email, website }, status: "Success" | "Error"

  // 1. Generate PDF
  const doc = new PDFDocument();
  const buffers: Buffer[] = [];
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', async () => {
    const pdfData = Buffer.concat(buffers);

    // 2. Send Email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: '"Madarth" <manoj@madarth.com>',
      to: customer.email,
      subject: `Your Invoice for SEO Audit – SEOA001`,
      text: `Dear ${customer.name},\n\nThank you for your recent request for an SEO audit for your website ${customer.website}.\n\nPlease find attached your invoice (No: SEOA001) for this service.\nIf you have any questions, feel free to reach out.\n\nBest regards,\nTeam Madarth`,
      attachments: [
        {
          filename: 'invoice_SEOA001.pdf',
          content: pdfData,
        },
      ],
    });
  });

  // PDF Content
  doc.image(path.join(process.cwd(), 'public/assets/logo.png'), 50, 45, { width: 100 });
  doc.fontSize(20).text('INVOICE', 50, 100);
  doc.text('Madarth', 50, 130);
  doc.text('4, Alamelu Manga Puram Rd, Saradapuram, Mylapore, Chennai, Tamil Nadu 600004', 50, 150);
  doc.text('GST No: 33AAFCP8848R1ZI', 50, 170);
  doc.text(`Invoice Number: SEOA001`, 50, 190);
  doc.text(`Service: SEO Audit for ${customer.website}`, 50, 210);
  doc.text(`Customer: ${customer.name}`, 50, 230);
  doc.text(`Email: ${customer.email}`, 50, 250);
  doc.text(`Status: ${status}`, 50, 270);
  doc.end();

  return NextResponse.json({ success: true });
}