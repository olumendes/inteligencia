import { RequestHandler } from "express";
import { Resend } from "resend";

interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const handleContact: RequestHandler = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body as ContactRequest;

    if (!name || !email || !message) {
      return res.status(400).json({
        error: "Nome, email e mensagem são obrigatórios",
      });
    }

    if (resend) {
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
    } else {
      console.warn('RESEND_API_KEY not configured - email not sent for contact');
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
