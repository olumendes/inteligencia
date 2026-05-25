import { RequestHandler } from "express";
import nodemailer from "nodemailer";
import { Resend } from "resend";

interface TrialSignupRequest {
  name: string;
  email: string;
  phone: string;
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

export const handleTrialSignup: RequestHandler = async (req, res) => {
  try {
    const { name, email, phone } = req.body as TrialSignupRequest;

    if (!name || !email || !phone) {
      return res.status(400).json({
        error: "Nome, email e telefone são obrigatórios",
      });
    }

    let emailSent = false;

    // Send notification to admin
    if (resend) {
      try {
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: "inteligencialicitatoria@gmail.com",
          replyTo: email,
          subject: `Novo cadastro para teste grátis - ${name}`,
          html: `
            <h2>Novo Cadastro para Teste Grátis</h2>
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Telefone:</strong> ${phone}</p>
            <p><em>Data:</em> ${new Date().toLocaleString("pt-BR")}</p>
          `,
        });

        // Send confirmation email to user
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: email,
          subject: "Bem-vindo ao Inteligência Licitatória - Seu teste grátis foi ativado!",
          html: `
            <h2>Bem-vindo, ${name}!</h2>
            <p>Seu teste grátis de 14 dias foi ativado com sucesso.</p>
            <p>Você agora tem acesso a todos os recursos do Inteligência Licitatória sem custo algum.</p>
            <h3>Próximos passos:</h3>
            <ol>
              <li>Informe suas palavras-chave (produtos/serviços que você vende)</li>
              <li>Configure suas preferências de alertas por email</li>
              <li>Receba oportunidades de licitações automaticamente</li>
            </ol>
            <p><strong>Validade do teste:</strong> 14 dias a partir de hoje</p>
            <p>Qualquer dúvida, responda este email ou acesse nosso suporte.</p>
            <p>Sucesso!</p>
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
          subject: `Novo cadastro para teste grátis - ${name}`,
          html: `
            <h2>Novo Cadastro para Teste Grátis</h2>
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Telefone:</strong> ${phone}</p>
            <p><em>Data:</em> ${new Date().toLocaleString("pt-BR")}</p>
          `,
        });

        await gmailTransporter.sendMail({
          from: process.env.GMAIL_USER,
          to: email,
          subject: "Bem-vindo ao Inteligência Licitatória - Seu teste grátis foi ativado!",
          html: `
            <h2>Bem-vindo, ${name}!</h2>
            <p>Seu teste grátis de 14 dias foi ativado com sucesso.</p>
            <p>Você agora tem acesso a todos os recursos do Inteligência Licitatória sem custo algum.</p>
            <h3>Próximos passos:</h3>
            <ol>
              <li>Informe suas palavras-chave (produtos/serviços que você vende)</li>
              <li>Configure suas preferências de alertas por email</li>
              <li>Receba oportunidades de licitações automaticamente</li>
            </ol>
            <p><strong>Validade do teste:</strong> 14 dias a partir de hoje</p>
            <p>Qualquer dúvida, responda este email ou acesse nosso suporte.</p>
            <p>Sucesso!</p>
          `,
        });
        emailSent = true;
      } catch (error) {
        console.warn('Gmail email failed:', error);
      }
    }

    if (!emailSent) {
      console.warn('No email service available - trial signup not sent');
    }

    res.json({
      success: true,
      message: "Teste grátis ativado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao ativar teste grátis:", error);
    res.status(500).json({
      error: "Erro ao ativar teste grátis",
    });
  }
};
