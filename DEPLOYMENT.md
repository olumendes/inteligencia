# Guia de Deployment - Cloudflare

## Opções de Deployment

### Opção 1: Cloudflare Pages (Recomendado para SPA estática)

#### Pré-requisitos
- Conta Cloudflare
- Domínio configurado no Cloudflare
- Wrangler CLI instalado: `npm install -g wrangler`

#### Passos

1. **Login no Cloudflare**
   ```bash
   wrangler auth
   ```

2. **Deploy do projeto**
   ```bash
   wrangler pages deploy dist/spa --project-name inteligencia-licitatoria
   ```

3. **Configurar variáveis de ambiente via Cloudflare Dashboard**
   - Vá para Pages > Projeto > Settings > Environment Variables
   - Adicione as seguintes variáveis:
     - `GMAIL_USER` = `luandimave@gmail.com`
     - `GMAIL_APP_PASSWORD` = `kfkc ixkn fnlt jvme`
     - `PING_MESSAGE` = (opcional)

4. **Configurar domínio customizado**
   - Pages > Projeto > Custom domains
   - Adicione `inteligencialicitatoria.com` ou seu domínio

### Opção 2: Cloudflare Workers (Para API + Frontend)

#### Pré-requisitos
- Conta Cloudflare
- Wrangler CLI instalado

#### Passos

1. **Build da aplicação**
   ```bash
   pnpm run build
   ```

2. **Deploy**
   ```bash
   wrangler deploy
   ```

3. **Definir secrets**
   ```bash
   wrangler secret put GMAIL_USER --env production
   wrangler secret put GMAIL_APP_PASSWORD --env production
   ```

   Quando solicitado, digite:
   - GMAIL_USER: `luandimave@gmail.com`
   - GMAIL_APP_PASSWORD: `kfkc ixkn fnlt jvme`

4. **Verificar status**
   ```bash
   wrangler deployments list
   ```

## Variáveis de Ambiente

As seguintes variáveis devem ser configuradas no ambiente de produção:

| Variável | Valor |
|----------|-------|
| `GMAIL_USER` | `luandimave@gmail.com` |
| `GMAIL_APP_PASSWORD` | `kfkc ixkn fnlt jvme` |
| `PING_MESSAGE` | (Opcional) |

## Health Check

Após o deploy, teste os endpoints:

```bash
# Teste de conexão
curl https://seu-dominio.com/api/ping

# Teste de contato (POST)
curl -X POST https://seu-dominio.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste",
    "email": "teste@example.com",
    "phone": "123456789",
    "message": "Mensagem de teste"
  }'
```

## Monitoramento

- Acesse Cloudflare Dashboard > Analytics
- Monitore erros em Real-time logs
- Configure alertas conforme necessário

## Troubleshooting

### Emails não estão sendo enviados
1. Verifique se as credenciais Gmail estão corretas
2. Verifique logs: `wrangler tail`
3. Certifique-se de que "Senhas de app" está habilitado na conta Google

### SPA routing não funciona
1. Verifique arquivo `_redirects` está em `public/`
2. Certifique-se de que `_redirects` está incluído na build
3. Teste localmente: `wrangler pages publish dist/spa`

### CORS errors
- Verifique configuração CORS em `server/index.ts`
- Aumente `allowed origins` se necessário

## Rollback

Para reverter para uma versão anterior:

```bash
# List all deployments
wrangler deployments list

# Rollback to a previous deployment
wrangler deployments rollback <DEPLOYMENT_ID>
```
