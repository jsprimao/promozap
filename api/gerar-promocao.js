function fallback(dados){const produto=dados.produto||"Produto especial";const preco=dados.preco?(String(dados.preco).includes("R$")?dados.preco:`R$ ${dados.preco}`):"preço especial";const publico=dados.publico||"clientes";const diferencial=dados.diferencial||"qualidade especial";const validade=dados.validade||"somente hoje";return{modo:"demo",headline:"Oferta especial para hoje",subtitulo:`${produto} com condição especial`,oferta:`${produto} por ${preco}`,whatsapp_curto:`Olá! Hoje temos ${produto} por ${preco}. ${diferencial}. Oferta válida ${validade}. Quer que eu separe para você?`,whatsapp_persuasivo:`🔥 Oferta especial para hoje!\n\n${produto} por ${preco}.\n\n${diferencial}.\n\nCondição válida ${validade}. Para garantir, responda: EU QUERO.`,instagram:`${produto} por ${preco} ✨\n\n${diferencial}.\n\nAproveite ${validade} e chame no WhatsApp para garantir o seu.\n\n#promocao #oferta #whatsapp`,status:`${produto}\n${preco}\n${validade}\nPeça pelo WhatsApp`,estrategia:`Para ${publico}: publique no Status pela manhã, envie para clientes antigos e repita no fim da tarde. Use a frase “quer que eu separe para você?” para aumentar respostas.`,ideias:["Criar combo com 2 unidades","Dar brinde para os primeiros pedidos","Oferta relâmpago por horário","Cupom para clientes antigos"],imagePrompt:`Imagem publicitária profissional sem textos, destacando ${produto}, estética comercial premium, fundo limpo, iluminação profissional, espaço livre para adicionar textos depois.`,imageUrl:null,imageBase64:null,aviso:"OPENAI_API_KEY não configurada. Resultado em modo demonstração."}}
function parseJson(text){try{return JSON.parse(text)}catch(_){ }const m=String(text||"").match(/\{[\s\S]*\}/);if(m){try{return JSON.parse(m[0])}catch(_){}}return null}
async function gerarTextos(dados){const model=process.env.OPENAI_TEXT_MODEL||"gpt-4.1-mini";const prompt=`Você é um diretor de marketing especializado em pequenos negócios brasileiros que vendem por WhatsApp, Instagram e Status.

Crie uma promoção completa, profissional e persuasiva, sem exageros e sem promessas falsas.

DADOS DO NEGÓCIO:
Segmento: ${dados.segmentoLabel||dados.segmento||""}
Produto/serviço: ${dados.produto||""}
Preço: ${dados.preco||""}
Objetivo: ${dados.objetivoLabel||dados.objetivo||""}
Público-alvo: ${dados.publico||""}
Diferencial: ${dados.diferencial||""}
Tom: ${dados.tomLabel||dados.tom||""}
Validade/urgência: ${dados.validade||""}
Nome da loja: ${dados.nomeNegocio||""}
Oferta/cupom: ${dados.cupom||""}

INSTRUÇÕES DE COPY:
- Faça textos úteis para vender no WhatsApp.
- Seja simples, humano, específico e direto.
- Use no máximo 2 emojis por texto.
- Use gatilhos com ética: urgência real, benefício claro, facilidade e escassez quando fizer sentido.
- Evite frases genéricas demais.
- Crie 2 versões de WhatsApp: uma curta e uma persuasiva.

INSTRUÇÕES DA IMAGEM:
- O prompt da imagem deve pedir uma IMAGEM SEM TEXTOS, SEM letras e SEM preço.
- A imagem deve servir como fundo/visual profissional para depois o sistema sobrepor título e preço.
- Produto bonito, estética comercial, bem iluminado e com espaço negativo livre.

Responda SOMENTE em JSON válido neste formato:
{"headline":"título curto, forte e profissional","subtitulo":"subtítulo curto","oferta":"oferta resumida","whatsapp_curto":"texto curto para WhatsApp","whatsapp_persuasivo":"texto mais persuasivo para WhatsApp","instagram":"legenda para Instagram","status":"texto para Status","estrategia":"estratégia prática de venda","ideias":["ideia 1","ideia 2","ideia 3","ideia 4"],"imagePrompt":"prompt profissional para gerar imagem SEM TEXTOS"}`;const response=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{Authorization:`Bearer ${process.env.OPENAI_API_KEY}`,"Content-Type":"application/json"},body:JSON.stringify({model,input:prompt,text:{format:{type:"json_object"}}})});const raw=await response.text();if(!response.ok)throw new Error(`OpenAI text error ${response.status}: ${raw}`);const data=JSON.parse(raw);let output=data.output_text;if(!output&&Array.isArray(data.output))output=data.output.flatMap(o=>o.content||[]).map(c=>c.text||"").join("\n");const parsed=parseJson(output);if(!parsed)throw new Error("A IA não retornou JSON válido.");return parsed}
async function gerarImagem(prompt,dados){const model=process.env.OPENAI_IMAGE_MODEL||"gpt-image-1";const size=(dados.formato||"feed")==="story"?"1024x1536":"1024x1024";const finalPrompt=`Imagem publicitária profissional, realista e comercial para pequeno negócio brasileiro.

PROMPT PRINCIPAL:
${prompt}

REGRAS OBRIGATÓRIAS:
- Não coloque nenhuma palavra, texto, número, logo, preço ou letras na imagem.
- Não crie cartaz com escrita.
- Produto em destaque, fotografia comercial bonita.
- Deixe área livre/limpa para o sistema adicionar título e preço depois.
- Iluminação premium, composição elegante, visual pronto para anúncio.
- Alta qualidade, sem poluição visual.
Segmento: ${dados.segmentoLabel||dados.segmento||""}.
Produto: ${dados.produto||""}.
Público: ${dados.publico||""}.`;const response=await fetch("https://api.openai.com/v1/images/generations",{method:"POST",headers:{Authorization:`Bearer ${process.env.OPENAI_API_KEY}`,"Content-Type":"application/json"},body:JSON.stringify({model,prompt:finalPrompt,size,quality:"medium",n:1})});const raw=await response.text();if(!response.ok)throw new Error(`OpenAI image error ${response.status}: ${raw}`);const data=JSON.parse(raw);const first=data.data?.[0]||{};return{imageUrl:first.url||null,imageBase64:first.b64_json||null}}
export default async function handler(req,res){if(req.method!=="POST")return res.status(405).json({error:"Método não permitido"});try{const dados=req.body||{};if(!process.env.OPENAI_API_KEY)return res.status(200).json(fallback(dados));const textos=await gerarTextos(dados);let imagem={imageUrl:null,imageBase64:null};if(dados.gerarImagem!==false){try{imagem=await gerarImagem(textos.imagePrompt,dados)}catch(e){return res.status(200).json({modo:"ia_texto_apenas",...textos,imageUrl:null,imageBase64:null,aviso:`Textos gerados, mas a imagem falhou: ${e.message}`})}}return res.status(200).json({modo:"ia_real",...textos,...imagem,aviso:null})}catch(e){return res.status(500).json({error:"Erro ao gerar promoção",details:e.message})}}
