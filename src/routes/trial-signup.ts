import { json } from 'itty-router';

interface TrialSignupRequest {
  name: string;
  email: string;
  phone: string;
}

interface Env {
  RESEND_API_KEY: string;
}

export const handleTrialSignup = async (request: Request, env: Env): Promise<Response> => {
  try {
    const body = await request.json() as TrialSignupRequest;
    const { name, email, phone } = body;

    if (!name || !email || !phone) {
      return json(
        {
          error: 'Nome, email e telefone são obrigatórios',
        },
        { status: 400 }
      );
    }

    const adminEmailHtml = `
      <h2>Novo Cadastro para Teste Grátis</h2>
      <p><strong>Nome:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Telefone:</strong> ${escapeHtml(phone)}</p>
      <p><em>Data:</em> ${new Date().toLocaleString('pt-BR')}</p>
    `;

    const userEmailHtml = `
      <h2>Bem-vindo, ${escapeHtml(name)}!</h2>
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
    `;

    // Send notification to admin
    const adminEmailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: 'inteligencialicitatoria@gmail.com',
        replyTo: email,
        subject: `Novo cadastro para teste grátis - ${name}`,
        html: adminEmailHtml,
      }),
    });

    if (!adminEmailRes.ok) {
      throw new Error(`Resend API error: ${adminEmailRes.status}`);
    }

    // Send confirmation email to user
    const userEmailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Bem-vindo ao Inteligência Licitatória - Seu teste grátis foi ativado!',
        html: userEmailHtml,
      }),
    });

    if (!userEmailRes.ok) {
      throw new Error(`Resend API error: ${userEmailRes.status}`);
    }

    return json({
      success: true,
      message: 'Teste grátis ativado com sucesso',
    });
  } catch (error) {
    console.error('Erro ao ativar teste grátis:', error);
    return json(
      {
        error: 'Erro ao ativar teste grátis',
      },
      { status: 500 }
    );
  }
};

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
