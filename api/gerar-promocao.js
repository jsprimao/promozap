// Exemplo para Vercel Serverless Function.
// Configure OPENAI_API_KEY nas variáveis de ambiente da Vercel.
// Não coloque a chave da API no frontend.

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' })

  const dados = req.body

  return res.status(200).json({
    ok: true,
    modo: 'exemplo',
    recebido: dados,
    mensagem: 'Backend pronto para receber integração com IA real.'
  })
}
