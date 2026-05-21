import { RequestHandler } from "express";
import { Resend } from "resend";

interface TrialSignupRequest {
  name: string;
  email: string;
  phone: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const handleTrialSignup: RequestHandler = async (req, res) => {
  try {
    const { name, email, phone } = req.body as TrialSignupRequest;

    if (!name || !email || !phone) {
      return res.status(400).json({
        error: "Nome, email e telefone são obrigatórios",
      });
    }

    // Send notification to admin
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
