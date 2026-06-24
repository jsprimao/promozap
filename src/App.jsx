
import React, { useEffect, useMemo, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { Zap, Sparkles, Image, Copy, Download, CalendarDays, Crown, BarChart3, Settings, MessageCircle, Save, Trash2, Wand2, LayoutDashboard, Rocket, Lock, CheckCircle2 } from 'lucide-react'

const SEGMENTOS = {
  lanchonete:{label:'🍔 Lanchonete / Fast Food',colors:['#ef4444','#f59e0b'],emoji:'🔥😋🍟',tags:'#Lanche #Delivery #Promocao',angles:['fome imediata','sabor','preço baixo','delivery rápido']},
  padaria:{label:'🥖 Padaria',colors:['#92400e','#f59e0b'],emoji:'🥖☕🔥',tags:'#Padaria #PaoQuentinho #CafeDaTarde',angles:['produto fresco','rotina diária','café da tarde','forno quentinho']},
  mercado:{label:'🛒 Mercado / Mercearia',colors:['#15803d','#84cc16'],emoji:'🛒💰🔥',tags:'#Mercado #Economia #Oferta',angles:['economia','compra do mês','preço especial','estoque limitado']},
  roupas:{label:'👗 Loja de Roupas',colors:['#7c3aed','#ec4899'],emoji:'✨👗💜',tags:'#Moda #LookDoDia #Promocao',angles:['autoestima','últimas peças','novidade','combinação de look']},
  religiosos:{label:'🙏 Artigos Religiosos',colors:['#1d4ed8','#fbbf24'],emoji:'🙏✨💙',tags:'#ArtigosReligiosos #Fe #Catolico',angles:['fé','presente especial','novena','comunidade']},
  beleza:{label:'💅 Salão / Beleza',colors:['#be185d','#fb7185'],emoji:'💅✨💖',tags:'#Beleza #Salao #Autoestima',angles:['autoestima','agenda limitada','antes e depois','cuidado pessoal']},
  servicos:{label:'🧰 Prestador de Serviços',colors:['#0f766e','#06b6d4'],emoji:'🧰✅⚡',tags:'#Servicos #Atendimento #Orcamento',angles:['solução rápida','confiança','orçamento','agenda']}
}
const OBJETIVOS = {
  venderHoje:'Vender mais hoje',
  relampago:'Oferta relâmpago',
  queima:'Queima de estoque',
  novidade:'Divulgar novidade',
  retorno:'Trazer clientes de volta',
  ticket:'Aumentar ticket médio',
  fidelizar:'Fidelizar clientes'
}
const TONS = {direto:'Direto e objetivo',amigavel:'Amigável e persuasivo',urgente:'Urgente e chamativo',premium:'Premium e sofisticado',divertido:'Divertido e informal'}
const ESTILOS = {impacto:'Impactante',premium:'Premium',moderno:'Moderno',clean:'Clean',divertido:'Divertido'}
const planos = {gratis:{nome:'Grátis',limite:10,watermark:true},pro:{nome:'Pro',limite:300,watermark:false},premium:{nome:'Premium',limite:9999,watermark:false}}

function inicial(){return {segmento:'lanchonete',objetivo:'venderHoje',tom:'amigavel',estilo:'impacto',produto:'Coxinha de Frango',preco:'5,99',diferencial:'feita na hora com massa crocante',publico:'clientes da região',nomeNegocio:'PromoZap Lanches',whatsapp:'Peça agora pelo WhatsApp',cupom:'',validade:'Somente hoje',formato:'status'}}

function gerarCopyPro(f){
  const seg=SEGMENTOS[f.segmento], preco=f.preco?.includes('R$')?f.preco:`R$ ${f.preco||'preço especial'}`, produto=f.produto||'produto especial', diferencial=f.diferencial||'qualidade especial', validade=f.validade||'por tempo limitado', cupom=f.cupom?`\nUse o cupom: ${f.cupom}`:''
  let headline='PROMOÇÃO DO DIA', sub='preço especial para você aproveitar agora', gatilho='Só hoje ou enquanto durar o estoque.'
  if(f.objetivo==='relampago'){headline='OFERTA RELÂMPAGO';sub='aproveite antes que acabe';gatilho='Oferta por tempo limitado.'}
  if(f.objetivo==='queima'){headline='QUEIMA DE ESTOQUE';sub='últimas unidades com preço especial';gatilho='Acabou, acabou.'}
  if(f.objetivo==='novidade'){headline='NOVIDADE NA LOJA';sub='chegou novidade para você';gatilho='Peça antes que todos descubram.'}
  if(f.objetivo==='retorno'){headline='SENTIMOS SUA FALTA';sub='condição especial para você voltar';gatilho='Oferta especial para clientes.'}
  if(f.objetivo==='ticket'){headline='COMBO ESPECIAL';sub='leve mais pagando menos';gatilho='Excelente para aproveitar com família ou amigos.'}
  if(f.objetivo==='fidelizar'){headline='CLIENTE ESPECIAL';sub='uma condição pensada para você';gatilho='Válido para quem acompanha nossa loja.'}
  const whats=`${seg.emoji} ${headline}! ${seg.emoji}

Hoje temos *${produto}* por apenas *${preco}*.

${diferencial.charAt(0).toUpperCase()+diferencial.slice(1)}.

⚠️ ${gatilho}${cupom}

👉 Para garantir, responda esta mensagem com: *EU QUERO*.`
  const insta=`${headline} ✨

${produto} por ${preco}.

${diferencial}.

${validade}. Chame no WhatsApp e garanta o seu antes que acabe.

${seg.tags} #WhatsApp #OfertaDoDia`
  const status=`${headline} 🔥\n${produto}\nAPENAS ${preco}\n${validade}\n${f.whatsapp}`
  const sms=`${produto} por ${preco} hoje. ${validade}. Responda EU QUERO para garantir.`
  const estrategia=`Poste no Status entre 10h e 11h, envie para clientes que já compraram e repita no fim da tarde. Para ${f.publico}, use pergunta direta: “quer que eu separe para você?”.`
  const ideias=[`Combo: ${produto} + adicional por preço fechado`,`Leve 3 e pague menos`,`Brinde para os 10 primeiros pedidos`,`Oferta válida no horário de menor movimento`,`Cupom exclusivo para clientes antigos`]
  return {headline,sub,gatilho,whats,insta,status,sms,estrategia,ideias}
}

function App(){
  const [screen,setScreen]=useState('gerador')
  const [form,setForm]=useState(inicial())
  const [copy,setCopy]=useState(()=>gerarCopyPro(inicial()))
  const [foto,setFoto]=useState('')
  const [historico,setHistorico]=useState(()=>JSON.parse(localStorage.getItem('promozap_hist')||'[]'))
  const [plano,setPlano]=useState('pro')
  const [loading,setLoading]=useState(false)
  const adRef=useRef(null)
  const total=historico.length
  const seg=SEGMENTOS[form.segmento]
  useEffect(()=>localStorage.setItem('promozap_hist',JSON.stringify(historico)),[historico])
  function up(k,v){setForm(p=>({...p,[k]:v}))}
  function gerar(){setLoading(true);setTimeout(()=>{setCopy(gerarCopyPro(form));setLoading(false)},450)}
  function salvar(){const item={id:Date.now(),data:new Date().toLocaleString('pt-BR'),form,copy,foto};setHistorico([item,...historico].slice(0,60));alert('Promoção salva no histórico.')}
  function carregar(item){setForm(item.form);setCopy(item.copy);setFoto(item.foto||'');setScreen('gerador')}
  async function baixar(){if(!adRef.current)return;const canvas=await html2canvas(adRef.current,{scale:2,backgroundColor:null});const a=document.createElement('a');a.href=canvas.toDataURL('image/png');a.download='promozap-arte.png';a.click()}
  function copiar(t){navigator.clipboard.writeText(t);alert('Texto copiado!')}
  function img(e){const file=e.target.files?.[0];if(!file)return;const r=new FileReader();r.onload=ev=>setFoto(ev.target.result);r.readAsDataURL(file)}
  const promptIA=useMemo(()=>`Crie uma imagem publicitária profissional, alta conversão, para ${SEGMENTOS[form.segmento].label}, produto ${form.produto}, objetivo ${OBJETIVOS[form.objetivo]}, estilo ${ESTILOS[form.estilo]}, com sensação de urgência, iluminação comercial, composição limpa e espaço para texto grande. Evite textos pequenos e ilegíveis.`,[form])
  return <div className="app">
    <aside className="side">
      <div className="brand"><Zap/><div><b>Promo<span>Zap</span></b><small>IA para vender mais</small></div></div>
      <button onClick={()=>setScreen('gerador')} className={screen==='gerador'?'on':''}><Sparkles/>Nova promoção</button>
      <button onClick={()=>setScreen('historico')} className={screen==='historico'?'on':''}><Image/>Histórico</button>
      <button onClick={()=>setScreen('calendario')} className={screen==='calendario'?'on':''}><CalendarDays/>Calendário</button>
      <button onClick={()=>setScreen('dashboard')} className={screen==='dashboard'?'on':''}><LayoutDashboard/>Dashboard</button>
      <button onClick={()=>setScreen('config')} className={screen==='config'?'on':''}><Settings/>Configurações</button>
      <div className="plan"><Crown/><b>Plano {planos[plano].nome}</b><p>{total}/{planos[plano].limite} promoções geradas</p><select value={plano} onChange={e=>setPlano(e.target.value)}><option value="gratis">Grátis</option><option value="pro">Pro</option><option value="premium">Premium</option></select></div>
      <div className="support"><MessageCircle/> Suporte</div>
    </aside>
    <main className="main">
      <header><div><h1>Gerador de Promoções Profissionais com IA</h1><p>Arte, texto, legenda e estratégia prontos para WhatsApp, Instagram e Status.</p></div><div className="pill"><Rocket/> V2 Profissional</div></header>
      {screen==='gerador'&&<section className="grid">
        <div className="panel form">
          <h2>1. Dados da promoção</h2>
          <label>Segmento</label><select value={form.segmento} onChange={e=>up('segmento',e.target.value)}>{Object.entries(SEGMENTOS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select>
          <label>Objetivo</label><select value={form.objetivo} onChange={e=>up('objetivo',e.target.value)}>{Object.entries(OBJETIVOS).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select>
          <div className="two"><div><label>Produto/serviço</label><input value={form.produto} onChange={e=>up('produto',e.target.value)}/></div><div><label>Preço</label><input value={form.preco} onChange={e=>up('preco',e.target.value)}/></div></div>
          <label>Diferencial</label><input value={form.diferencial} onChange={e=>up('diferencial',e.target.value)}/>
          <div className="two"><div><label>Público-alvo</label><input value={form.publico} onChange={e=>up('publico',e.target.value)}/></div><div><label>Validade</label><input value={form.validade} onChange={e=>up('validade',e.target.value)}/></div></div>
          <div className="two"><div><label>Tom</label><select value={form.tom} onChange={e=>up('tom',e.target.value)}>{Object.entries(TONS).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></div><div><label>Estilo visual</label><select value={form.estilo} onChange={e=>up('estilo',e.target.value)}>{Object.entries(ESTILOS).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></div></div>
          <label>Nome do negócio</label><input value={form.nomeNegocio} onChange={e=>up('nomeNegocio',e.target.value)}/>
          <label>Chamada/WhatsApp</label><input value={form.whatsapp} onChange={e=>up('whatsapp',e.target.value)}/>
          <label>Cupom opcional</label><input value={form.cupom} onChange={e=>up('cupom',e.target.value)} placeholder="Ex: ZAP10"/>
          <label>Foto do produto</label><input type="file" accept="image/*" onChange={img}/>
          <button className="gen" onClick={gerar}><Wand2/>{loading?'Gerando...':'Gerar promoção completa'}</button>
          <div className="api"><b>Prompt de imagem IA:</b><p>{promptIA}</p></div>
        </div>
        <div className="panel result">
          <div className="actions"><button onClick={salvar}><Save/>Salvar</button><button onClick={baixar}><Download/>Baixar PNG</button></div>
          <div className="previewRow">
            <div className="ad" ref={adRef} style={{'--c1':seg.colors[0],'--c2':seg.colors[1]}}>
              <div className="bg"></div><div className="store">{form.nomeNegocio}</div><div className="badge">{copy.headline}</div>
              <div className="photo">{foto?<img src={foto}/>:<div><Sparkles/>{form.produto}</div>}</div>
              <h3>{form.produto}</h3><p>{form.diferencial}</p><div className="price">R$ {form.preco}</div><div className="cta">{form.whatsapp}</div>{planos[plano].watermark&&<small className="wm">Criado com PromoZap</small>}
            </div>
            <div className="versions"><h3>Formatos</h3><button>Status WhatsApp<br/><small>1080×1920</small></button><button>Feed Instagram<br/><small>1080×1080</small></button><button>Stories<br/><small>1080×1920</small></button><button>Banner<br/><small>1200×628</small></button></div>
          </div>
          <div className="texts"><Card title="WhatsApp" text={copy.whats} copy={copiar}/><Card title="Instagram" text={copy.insta} copy={copiar}/><Card title="Status" text={copy.status} copy={copiar}/><Card title="Estratégia" text={copy.estrategia} copy={copiar}/></div>
          <div className="ideas"><h3>Ideias extras</h3>{copy.ideias.map((i,idx)=><span key={idx}>{i}</span>)}</div>
        </div>
      </section>}
      {screen==='historico'&&<Historico items={historico} carregar={carregar} limpar={()=>setHistorico([])}/>}
      {screen==='calendario'&&<Calendario/>}
      {screen==='dashboard'&&<Dashboard total={total} historico={historico}/>}
      {screen==='config'&&<Config/>}
    </main>
  </div>
}

function Card({title,text,copy}){return <div className="card"><div><b>{title}</b><button onClick={()=>copy(text)}><Copy size={14}/>Copiar</button></div><p>{text}</p></div>}
function Historico({items,carregar,limpar}){return <div className="panel page"><h2>Histórico de promoções</h2><button className="danger" onClick={limpar}><Trash2/>Limpar histórico</button><div className="hist">{items.length===0?<p>Nenhuma promoção salva ainda.</p>:items.map(i=><div className="histItem" key={i.id}><b>{i.form.produto}</b><span>{i.data} • {SEGMENTOS[i.form.segmento].label}</span><button onClick={()=>carregar(i)}>Abrir</button></div>)}</div></div>}
function Calendario(){const datas=['Dia do Cliente','Black Friday','Natal','Dia das Mães','Dia dos Pais','Semana do Consumidor','Festa do Padroeiro','Volta às aulas'];return <div className="panel page"><h2>Calendário de ideias</h2><div className="calendar">{datas.map(d=><div key={d}><CalendarDays/><b>{d}</b><p>Crie uma promoção temática com urgência, brinde ou combo especial.</p></div>)}</div></div>}
function Dashboard({total,historico}){return <div className="panel page"><h2>Dashboard</h2><div className="dash"><div><BarChart3/><b>{total}</b><span>Promoções salvas</span></div><div><CheckCircle2/><b>{historico.filter(h=>h.form.objetivo==='venderHoje').length}</b><span>Foco venda hoje</span></div><div><Lock/><b>API</b><span>Pronta para conectar</span></div></div></div>}
function Config(){return <div className="panel page"><h2>Configurações e IA real</h2><p>Para usar IA real, conecte um backend seguro com OPENAI_API_KEY. O arquivo README explica o deploy e a integração.</p><pre>POST /api/gerar-promocao{'\n'}&#123; segmento, objetivo, produto, preco, diferencial &#125;</pre></div>}
export default App
