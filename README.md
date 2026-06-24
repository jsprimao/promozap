# PromoZap IA Pro - V2 Profissional

Sistema separado do CatalogZap para testar uma ferramenta comercial de promoções prontas.

## Como ver no computador

1. Descompacte o ZIP.
2. Abra o terminal dentro da pasta.
3. Rode:

```bash
npm install
npm run dev
```

4. Abra o link que aparecer, normalmente:

```bash
http://localhost:5173
```

## Como publicar na Vercel

1. Crie um repositório no GitHub.
2. Envie todos os arquivos desta pasta.
3. Entre na Vercel.
4. Clique em Add New Project.
5. Escolha o repositório.
6. Framework: Vite.
7. Build command: `npm run build`
8. Output directory: `dist`
9. Clique em Deploy.

## O que a V2 já tem

- Interface profissional.
- Segmentos por tipo de negócio.
- Objetivo da campanha.
- Textos persuasivos por contexto.
- Arte automática com foto do produto.
- Botão copiar textos.
- Botão baixar arte PNG.
- Histórico local de promoções.
- Calendário de ideias.
- Dashboard.
- Planos simulados: Grátis, Pro e Premium.
- Estrutura de API preparada para IA real.

## Sobre IA real

A versão funciona em modo demonstração com um motor local de textos e artes.

Para IA real, é necessário:
- Chave de API.
- Backend seguro.
- Função serverless ou Supabase Edge Function.

Nunca coloque a chave da OpenAI diretamente no navegador.

O arquivo `api/gerar-promocao.js` é o ponto inicial para conectar IA real.
