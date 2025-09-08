# 💰 Integração PIX - AmloPay para Doações

Este projeto implementa uma integração completa com o gateway de pagamento AmloPay para receber doações via PIX.

## 🚀 Configuração

### 1. Credenciais da API
As seguintes credenciais já estão configuradas no sistema:

```
Public Key: murillot2004_f443f52tx77685f5
Secret Key: 5gu5mbg909m53xs9cph9kb08dftavp2zyuzq7j05cm1uf20cuykqrxeq00dpprce
Base URL: https://app.amplopay.com/api/v1
```

### 2. Arquivos da Integração

#### Backend (PHP)
- `api_pix.php` - API principal para gerar PIX
- `webhook.php` - Recebe notificações de pagamento da AmloPay
- `test_api.php` - Testa conectividade com a API
- `test_integration.html` - Interface completa de testes

#### Frontend (JavaScript)
- Integração direta no `index.html` com modal PIX
- Interface responsiva e moderna
- Validação de valores e feedback visual

## 🔧 Como Funciona

### 1. Fluxo de Doação
1. **Usuário clica em "Quero Ajudar"** → Abre modal PIX
2. **Seleciona valor** → R$ 10, 25, 50, 100 ou valor customizado
3. **Clica "Gerar PIX"** → Chama `api_pix.php`
4. **API gera PIX** → Retorna QR Code e código PIX
5. **Usuário paga** → Via app bancário
6. **AmloPay confirma** → Envia webhook para `webhook.php`
7. **Sistema atualiza** → Logs e estatísticas

### 2. Estrutura da API PIX

```php
// Requisição para api_pix.php
POST /api_pix.php
Content-Type: application/json

{
    "amount": 25.00
}
```

```php
// Resposta de sucesso
{
    "success": true,
    "payment_id": "pix_123456789",
    "amount": 25.00,
    "pix_qr_code": "data:image/png;base64,iVBORw0KGgoAAAANSU...",
    "pix_code": "00020126580014br.gov.bcb.pix...",
    "status": "pending",
    "message": "PIX gerado com sucesso!"
}
```

### 3. Webhook de Confirmação

Quando um pagamento é aprovado, a AmloPay envia:

```php
POST /webhook.php
Content-Type: application/json

{
    "event": "payment.completed",
    "payment_id": "pix_123456789",
    "status": "approved",
    "amount": 25.00,
    "timestamp": "2025-01-20T10:30:00Z"
}
```

## 🧪 Testes

### 1. Teste Rápido
Abra `test_integration.html` no navegador para:
- ✅ Testar conectividade com AmloPay
- ✅ Gerar PIX de teste
- ✅ Simular webhook
- ✅ Ver logs e estatísticas

### 2. Teste Manual
1. Abra `index.html`
2. Clique em "Quero Ajudar"
3. Selecione um valor
4. Clique "Gerar PIX"
5. Verifique se QR Code aparece

### 3. Teste de Produção
Para testar com pagamento real:
1. Use valores pequenos (R$ 1,00)
2. Monitore os logs em `webhook_logs.txt`
3. Verifique `donation_counter.json`

## 📊 Monitoramento

### Logs Disponíveis
- `webhook_logs.txt` - Log detalhado de webhooks
- `donations_log.txt` - Histórico de doações aprovadas
- `donation_counter.json` - Estatísticas em tempo real

### Exemplo de Estatísticas
```json
{
    "total": 150.50,
    "count": 8,
    "last_update": "2025-01-20 10:30:00"
}
```

## 🔒 Segurança

### Validações Implementadas
- ✅ Verificação de método HTTP (POST apenas)
- ✅ Validação de JSON
- ✅ Sanitização de valores
- ✅ Headers CORS configurados
- ✅ Timeout de conexão (30s)
- ✅ Log de todas as transações

### Webhook Security
- Verificação de assinatura (se fornecida pela AmloPay)
- Validação de origem
- Log de tentativas suspeitas

## 🚨 Troubleshooting

### Problemas Comuns

#### 1. PIX não é gerado
- Verifique credenciais em `api_pix.php`
- Teste conectividade com `test_api.php`
- Verifique logs de erro do PHP

#### 2. Webhook não funciona
- Confirme URL do webhook na AmloPay: `https://seusite.com/webhook.php`
- Verifique permissões de escrita nos arquivos de log
- Teste com `test_integration.html`

#### 3. Modal não abre
- Verifique console do navegador (F12)
- Confirme se JavaScript está carregando
- Teste em navegador atualizado

### Debug
```bash
# Ver logs do PHP (se disponível)
tail -f /var/log/php_errors.log

# Ver logs do webhook
tail -f webhook_logs.txt

# Testar API diretamente
curl -X POST https://seusite.com/api_pix.php \
  -H "Content-Type: application/json" \
  -d '{"amount": 10.00}'
```

## 📱 Recursos Implementados

### ✅ Frontend
- [x] Modal responsivo para PIX
- [x] Seleção de valores pré-definidos
- [x] Campo para valor customizado
- [x] Exibição de QR Code
- [x] Código PIX copiável
- [x] Loading e feedback visual
- [x] Tratamento de erros
- [x] Integração com botões existentes

### ✅ Backend
- [x] API PIX completa
- [x] Webhook para confirmações
- [x] Sistema de logs
- [x] Contador de doações
- [x] Validações de segurança
- [x] Tratamento de erros
- [x] Suporte a CORS

### ✅ Testes
- [x] Interface de testes
- [x] Testes de conectividade
- [x] Simulação de webhook
- [x] Visualização de logs
- [x] Estatísticas em tempo real

## 🔄 Próximos Passos

### Melhorias Sugeridas
1. **Banco de Dados** - Migrar de arquivos para MySQL/PostgreSQL
2. **Dashboard Admin** - Interface para gerenciar doações
3. **Notificações Email** - Enviar confirmações automáticas
4. **Relatórios** - Gráficos e análises de doações
5. **Backup** - Sistema de backup dos dados
6. **Cache** - Implementar cache para melhor performance

### Integração com Outros Gateways
- Mercado Pago
- PagSeguro
- Stripe (cartão internacional)

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte os logs em `webhook_logs.txt`
2. Use `test_integration.html` para diagnóstico
3. Verifique a documentação da AmloPay: https://app.amplopay.com/docs
4. Contate o suporte técnico da AmloPay se necessário

---

**🎯 Integração concluída e pronta para produção!**

A integração PIX está funcionando e pode receber doações reais. Monitore os logs e ajuste conforme necessário.
