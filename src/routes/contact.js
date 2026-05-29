import { json } from 'itty-router';
export const handleContact = async (request, env) => {
    try {
        const body = await request.json();
        const { name, email, phone, message } = body;
        if (!name || !email || !message) {
            return json({
                error: 'Nome, email e mensagem são obrigatórios',
            }, { status: 400 });
        }
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return json({
                error: 'Email inválido',
            }, { status: 400 });
        }
        if (!env.RESEND_API_KEY) {
            // If RESEND_API_KEY is not configured, still accept the contact but don't send emails
            console.warn('RESEND_API_KEY is not configured - contact received but emails not sent');
            return json({
                success: true,
                message: 'Email recebido com sucesso',
            });
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
        return json({
            success: true,
            message: 'Email enviado com sucesso',
        });
    }
    catch (error) {
        console.error('Erro ao enviar email:', error);
        return json({
            error: 'Erro ao enviar email',
        }, { status: 500 });
    }
};
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (char) => map[char]);
}
