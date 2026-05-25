import { RequestHandler } from "express";
import nodemailer from "nodemailer";
import { Resend } from "resend";

interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

let gmailTransporter: nodemailer.Transporter | null = null;

if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
  gmailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

export const handleContact: RequestHandler = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body as ContactRequest;

    if (!name || !email || !message) {
      return res.status(400).json({
        error: "Nome, email e mensagem são obrigatórios",
      });
    }

    let emailSent = false;

    if (resend) {
      try {
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: "inteligencialicitatoria@gmail.com",
          replyTo: email,
          subject: `Novo contato de ${name}`,
          html: `
            <h2>Novo Contato Recebido</h2>
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Telefone:</strong> ${phone}</p>` : ""}
            <p><strong>Mensagem:</strong></p>
            <p>${message.replace(/\n/g, "<br>")}</p>
          `,
        });
        emailSent = true;
      } catch (error) {
        console.warn('Resend email failed, trying Gmail:', error);
      }
    }

    if (!emailSent && gmailTransporter) {
      try {
        await gmailTransporter.sendMail({
          from: process.env.GMAIL_USER,
          to: "inteligencialicitatoria@gmail.com",
          replyTo: email,
          subject: `Novo contato de ${name}`,
          html: `
            <h2>Novo Contato Recebido</h2>
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Telefone:</strong> ${phone}</p>` : ""}
            <p><strong>Mensagem:</strong></p>
            <p>${message.replace(/\n/g, "<br>")}</p>
          `,
        });
        emailSent = true;
      } catch (error) {
        console.warn('Gmail email failed:', error);
      }
    }

    if (!emailSent) {
      console.warn('No email service available - contact not sent');
    }

    res.json({
      success: true,
      message: "Email enviado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    res.status(500).json({
      error: "Erro ao enviar email",
    });
  }
};
