# PromoZap V3 - Fase 1 IA Real

Esta versão chama uma API da Vercel em `/api/gerar-promocao`.

## Ativar IA real

Na Vercel, vá em Settings > Environment Variables e adicione:

```txt
OPENAI_API_KEY=sua_chave_openai
OPENAI_TEXT_MODEL=gpt-4.1-mini
OPENAI_IMAGE_MODEL=gpt-image-1
```

Depois clique em Redeploy.

Sem a chave, o sistema roda em modo demonstração.
