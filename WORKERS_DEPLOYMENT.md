# Cloudflare Workers Deployment Guide

## Estrutura da Refatoração

O backend foi refatorado de Express.js para Cloudflare Workers usando:
- **itty-router**: Router leve para Workers
- **Cloudflare Workers**: Runtime serverless
- **Wrangler**: CLI para gerenciar Workers

## Arquivos Criados

```
src/
├── index.ts                 # Main handler com rotas
├── routes/
│   ├── demo.ts             # GET /api/demo
│   ├── contact.ts          # POST /api/contact
│   └── trial-signup.ts     # POST /api/trial-signup
└── shared/
    └── api.ts              # Shared types

wrangler.toml               # Configuração do Wrangler
```

## Setup Local

1. **Instalar dependências**
```bash
pnpm install
```

2. **Criar conta Cloudflare**
   - Acesse https://dash.cloudflare.com
   - Sign up ou login

3. **Autenticar Wrangler**
```bash
pnpm wrangler login
```

4. **Definir variáveis de ambiente (secrets)**
```bash
pnpm wrangler secret put RESEND_API_KEY
# Cole sua API key do Resend

pnpm wrangler secret put GMAIL_USER
pnpm wrangler secret put GMAIL_APP_PASSWORD
```

5. **Testar localmente**
```bash
pnpm workers:dev
# O API estará disponível em http://localhost:8787
```

## Deploy para Produção

### Opção 1: Deploy via CLI (recomendado)
```bash
pnpm build:workers
```

### Opção 2: Deploy via Git (GitHub Actions)
1. Conecte seu repositório GitHub na dashboard Cloudflare
2. Configure ambiente production em `wrangler.toml`
3. Push para a branch configurada

## Endpoints da API

Todos os endpoints estarão disponíveis em: `https://seu-workers.workers.dev`

### GET `/api/ping`
```bash
curl https://seu-workers.workers.dev/api/ping
```
Resposta:
```json
{
  "message": "ping pong"
}
```

### POST `/api/demo`
```bash
curl https://seu-workers.workers.dev/api/demo
```

### POST `/api/contact`
```bash
curl -X POST https://seu-workers.workers.dev/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João",
    "email": "joao@example.com",
    "phone": "11999999999",
    "message": "Olá, gostaria de informações"
  }'
```

### POST `/api/trial-signup`
```bash
curl -X POST https://seu-workers.workers.dev/api/trial-signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria",
    "email": "maria@example.com",
    "phone": "21988888888"
  }'
```

## Configurar Frontend para apontar para Workers

Em `client/`, atualize as chamadas de API para apontar para seu domínio Workers:

```typescript
const API_URL = 'https://seu-workers.workers.dev';

fetch(`${API_URL}/api/contact`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
```

## Deploy Completo (Frontend + Backend)

### 1. Frontend no Cloudflare Pages
```bash
# Build frontend
pnpm build:client

# Deploy via Wrangler ou dashboard
# https://dash.cloudflare.com/pages
```

### 2. Backend no Cloudflare Workers
```bash
pnpm build:workers
```

### 3. Configurar domínio customizado (opcional)
Na dashboard Cloudflare, configure um domínio customizado para seu Worker.

## Monitoramento

Acesse a dashboard Cloudflare para:
- Ver logs em tempo real
- Monitorar performance
- Verificar quotas de requisições
- Configurar alertas

## Limitações e Quotas

**Plano Free:**
- 100,000 requisições/dia
- Sem limite de Workers

**Plano Paid:**
- Requisições ilimitadas
- Suporte prioritário
- Analytics avançado

## Troubleshooting

### Erro: "Workers auth failed"
```bash
pnpm wrangler logout
pnpm wrangler login
```

### Erro: "RESEND_API_KEY undefined"
```bash
pnpm wrangler secret put RESEND_API_KEY
```

### Ver logs
```bash
pnpm wrangler tail
```

## Próximos Passos

1. Deploy do Workers
2. Atualizar URLs do frontend
3. Testar cada endpoint
4. Configurar domínio customizado
5. Monitorar performance
