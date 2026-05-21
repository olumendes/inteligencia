import { RequestHandler } from "express";
import nodemailer from "nodemailer";

interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const handleContact: RequestHandler = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body as ContactRequest;

    if (!name || !email || !message) {
      return res.status(400).json({
        error: "Nome, email e mensagem são obrigatórios",
      });
    }

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: "inteligencialicitatoria@gmail.com",
      subject: `Novo contato de ${name}`,
      html: `
        <h2>Novo Contato Recebido</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Telefone:</strong> ${phone}</p>` : ""}
        <p><strong>Mensagem:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);

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
