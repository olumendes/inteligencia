interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

interface Env {
  RESEND_API_KEY: string;
}

export const handleContact = async (request: Request, env: Env): Promise<Response> => {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { name, email, phone, message } = (await request.json()) as ContactRequest;

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({
          error: 'Nome, email e mensagem são obrigatórios',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const emailHtml = `
      <h2>Novo Contato Recebido</h2>
      <p><strong>Nome:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      ${phone ? `<p><strong>Telefone:</strong> ${escapeHtml(phone)}</p>` : ''}
      <p><strong>Mensagem:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: 'inteligencialicitatoria@gmail.com',
        replyTo: email,
        subject: `Novo contato de ${name}`,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      throw new Error(`Resend API error: ${response.status}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email enviado com sucesso',
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return new Response(
      JSON.stringify({
        error: 'Erro ao enviar email',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
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
