# Planejamento MVP — UsinaVR Fase 3: Acessibilidade para Deficiência Visual e Auditiva

**Projeto:** UsinaVR — Museu Digital Imersivo  
**Hackathon:** Hackweb Web3 — RESTIC 29 / Desafio ExpoVerse  
**Aluno:** Joney Sousa Pereira  
**Fase:** 3 — Acessibilidade Inclusiva (Audiodescrição + LIBRAS)  
**Base:** Continuação da branch `feature/modelos-gltf` (Fase 2)

---

## 1. Objetivo desta fase

A Fase 2 elevou o realismo visual com modelos glTF/PBR. O objetivo da Fase 3 é garantir que a experiência do UsinaVR seja **plenamente acessível a pessoas com deficiência visual e auditiva**, implementando dois recursos fundamentais:

1. **Audiodescrição** — narração em áudio descrevendo cada obra para pessoas com deficiência visual (DV), conforme as diretrizes da ABNT NBR 15290 e da Lei Brasileira de Inclusão (LBI — Lei 13.146/2015).
2. **Vídeo em LIBRAS** — Língua Brasileira de Sinais — para cada obra, tornando o conteúdo informativo acessível a pessoas surdas, conforme o Decreto 5.626/2005.

Além disso, a fase inclui melhorias gerais de acessibilidade na interface (contraste, navegação por teclado, ARIA labels) que beneficiam o conjunto da experiência.

> **Contexto legal:** A LBI (Art. 63) determina que sítios eletrônicos e aplicações voltadas ao público devem conter recursos de acessibilidade. Museus digitais com financiamento ou vínculo público têm obrigação expressa. O UsinaVR, como projeto de democratização cultural, deve ser referência nessa direção.

---

## 2. Arquitetura da solução de acessibilidade

### 2.1 Visão geral dos recursos por perfil

| Recurso | Beneficiário | Formato | Acionamento |
|---|---|---|---|
| Audiodescrição da obra | Deficiência visual | Arquivo `.mp3` | Automático ao se aproximar da obra (trigger de proximidade) |
| Leitura do painel informativo | Deficiência visual | Text-to-Speech (Web Speech API) | Botão no painel flutuante |
| Vídeo em LIBRAS | Deficiência auditiva | Arquivo `.mp4` (avatar ou intérprete) | Botão no painel flutuante |
| Legendas automáticas | Deficiência auditiva | Faixa `.vtt` sincronizada | Ativo por padrão nos vídeos |
| Navegação por teclado | Motor/Visual | Tab + Enter + setas | Global na interface |
| Alto contraste | Deficiência visual leve | CSS `prefers-contrast` | Automático via media query |
| Escala de fonte ajustável | Deficiência visual leve | CSS `rem` + slider | Painel de acessibilidade |

### 2.2 Fluxo de experiência acessível

```
Usuário entra na cena
        │
        ▼
[MODAL INICIAL DE PREFERÊNCIAS DE ACESSIBILIDADE]
  ┌─────────────────────────────────────────────┐
  │  Como você prefere explorar o museu?        │
  │                                             │
  │  ◉ Experiência padrão                      │
  │  ○ Com audiodescrição (DV)                 │
  │  ○ Com LIBRAS ativo por padrão (surdos)    │
  │  ○ Modo alto contraste                     │
  └─────────────────────────────────────────────┘
        │
        ▼
Preferência salva em localStorage
        │
  ┌─────┴──────┐
  ▼            ▼
Modo DV     Modo Surdo
  │            │
  ▼            ▼
Audiodescrição  Vídeo LIBRAS
automática ao   abre junto com
se aproximar    o painel informativo
```

---

## 3. Audiodescrição — Deficiência Visual

### 3.1 O que é e por que importa

A audiodescrição é uma narração em áudio que descreve visualmente o que não pode ser percebido auditivamente: a forma, a cor, a textura, a escala e o contexto emocional de cada obra. Para um museu virtual em 3D, ela é o equivalente digital do serviço oferecido por museus físicos acessíveis.

### 3.2 Roteiro de audiodescrição por obra

Cada audiodescrição deve ter **dois níveis**, inspirados na prática audiovisual acessível:

- **Descrição concisa (~20s):** acionada ao se aproximar, descreve a obra em poucas frases essenciais.
- **Descrição estendida (~90s):** acionada pelo botão "Saiba mais", aprofunda contexto artístico, história e sensações evocadas.

---

#### OBRA 1 — Locomotiva Histórica

**Descrição concisa:**
> *"À sua frente, uma locomotiva a vapor do início do século XX. O veículo metálico de cor escura possui caldeira cilíndrica horizontal, chaminé vertical no centro e rodas largas de aço em ambos os lados. Ela repousa sobre trilhos enferrujados, emoldurada pela vegetação tropical do parque."*

**Descrição estendida:**
> *"A locomotiva que você contempla é uma réplica do veículo histórico que transportou cana-de-açúcar pela Usina Santa Terezinha desde sua fundação em 1929. Com cerca de oito metros de comprimento e três de altura, domina a entrada do parque como marco monumental da memória do trabalho agrícola no interior de Pernambuco. A caldeira escurecida pelo tempo guarda décadas de vapor, fuligem e movimento. As rodas de aço — grandes e imponentes nas extremidades, menores no centro — contam a mecânica de uma era inteira. No exterior pernambucano, sob o sol dourado do entardecer, a locomotiva não é apenas maquinário: é símbolo de uma civilização construída sobre a doçura e o suor da cana."*

---

#### OBRA 2 — Diva (Juliana Notari)

**Descrição concisa:**
> *"Diante de você, uma grande escultura vermelha encravada na encosta de uma colina. A forma é alongada e vertical, com uma abertura central que se aprofunda como uma fenda na terra. A cor é vermelha intensa, brilhante, contrastando com o verde da vegetação ao redor."*

**Descrição estendida:**
> *"'Diva' é uma obra monumental da artista recifense Juliana Notari, aqui representada em escala significativa sobre uma colina de terra. A escultura em poliuretano e fibra de vidro apresenta uma superfície lisa e vermelha-viva, com um rasgo vertical que se abre desde o topo até a base — uma ferida ou portal que divide a forma ao meio. A luz do entardecer intensifica o vermelho, criando um efeito quase incandescente. A obra evoca o corpo feminino, a terra, a ferida e o renascimento simultaneamente. Seu título, 'Diva', carrega ironia e grandiosidade ao mesmo tempo. Caminhe ao redor dela para perceber como a fenda muda de aparência conforme o ângulo de visão — às vezes fechada, às vezes escancarada, dependendo de onde você estiver."*

---

#### OBRA 3 — Paisagem (Regina Silveira)

**Descrição concisa:**
> *"À sua frente, duas fileiras paralelas de painéis de vidro industrial suspendidos por uma grade metálica. Cada vidro apresenta um padrão de rachaduras irradiando de um ponto central — como se tivesse recebido o impacto de um tiro. A luz atravessa os vidros criando reflexos e sombras no chão."*

**Descrição estendida:**
> *"'Paisagem' é uma obra da artista paulista Regina Silveira que transforma violência em poética visual. Cinquenta e nove painéis de vidro industrial — dispostos em duas fileiras que formam um corredor de passagem — foram marcados por disparos de espingarda. Cada vidro carrega o registro único de seu impacto: um buraco central cercado de rachaduras que se irradiam como uma teia. Ao atravessar o corredor, você percorre uma história de violência e sobrevivência. A luz que filtra pelos vidros fragmentados projeta sombras geométricas irregulares no chão, transformando o espaço ao longo do dia conforme o ângulo do sol muda. A obra confronta o espectador com a fragilidade do vidro — e com a fragilidade de qualquer paisagem diante da força humana."*

---

#### OBRA 4 — Brasil 2017 (Paulo Bruscky)

**Descrição concisa:**
> *"Você se aproxima de uma instalação sobre uma mesa longa coberta de papéis, envelopes e carimbos. As peças são amareladas pelo tempo, com marcas vermelhas de tinta de carimbo. Uma parede ao fundo exibe uma colagem densa de documentos superpostos."*

**Descrição estendida:**
> *"'Brasil 2017' é uma obra do artista recifense Paulo Bruscky, referência da arte postal e conceitual brasileira desde os anos 1970. A instalação reúne envelopes selados, cartas abertas, carimbos de borracha, mapas e documentos — a linguagem gráfica do Estado e da burocracia — reorganizados como arquivo crítico do momento político. O amarelamento dos papéis evoca o tempo, o acúmulo, a memória. Os carimbos vermelhos — símbolos de aprovação, rejeição, controle — marcam cada superfície como feridas administrativas. Paulo Bruscky usa o sistema postal como meio artístico há décadas: a carta que viaja sem destino certo, o envelope que carrega mensagem impossível, o carimbo que autoriza o que não deveria ser autorizado. 'Brasil 2017' é um arquivo de um país em crise visto pela lente de um artista que nunca parou de enviar mensagens."*

---

#### OBRA 5 — Hangar José Rufino

**Descrição concisa:**
> *"Você entra em um hangar industrial de teto alto, com paredes de concreto e estrutura metálica. Suspensos por fios do teto, dezenas de facões pairam no ar à sua volta. Uma mesa central exibe documentos manuscritos sob luz cônica de spots direcionados."*

**Descrição estendida:**
> *"A instalação do artista paraibano José Rufino ocupa o hangar histórico da Usina Santa Terezinha — um espaço que em si já é parte da obra. O ambiente industrial de teto alto, colunas metálicas e janelas gradeadas abriga dezenas de facões suspensos por fios invisíveis, pairando no ar como memória suspensa do trabalho na cana. O facão foi por séculos o instrumento de corte da cana-de-açúcar no Nordeste — e também instrumento de violência, de luta, de sobrevivência. José Rufino os recolhe, limpa e suspende: retira o objeto do trabalho e o transforma em monumento. Na mesa central, documentos manuscritos — cartas, registros, inventários — constroem o arquivo afetivo de famílias ligadas à usina por gerações. Os spots de luz direcionada criam sombras longas dos facões no chão de concreto. Caminhe entre eles devagar: a sombra que você projeta se mistura à deles."*

---

### 3.3 Produção dos arquivos de áudio

**Opções de produção (em ordem de qualidade):**

| Opção | Custo | Qualidade | Processo |
|---|---|---|---|
| Intérprete humano gravado em estúdio | Alto | Máxima — expressividade real | Gravar `.wav`, editar no Audacity, exportar `.mp3` 128kbps |
| ElevenLabs (TTS neural) | Baixo | Alta — voz natural em PT-BR | API ou interface web, exportar `.mp3` |
| Google Cloud TTS (voz `pt-BR-Neural2`) | Baixo | Boa — gratuita até certa cota | API com SSML para pausas dramáticas |
| Web Speech API (navegador) | Zero | Aceitável — voz sintética | Geração em tempo real no browser, sem arquivo |

**Recomendação para o hackathon:** usar **ElevenLabs** para as descrições concisas (mais curtas, maior impacto na primeira impressão) e **Web Speech API** como fallback automático quando o arquivo não carregar.

**Formato de arquivo:** `.mp3`, 128kbps estéreo, normalizado a -14 LUFS (padrão de streaming).

**Nomenclatura:**
```
public/audio/
├── desc-locomotiva-curta.mp3
├── desc-locomotiva-longa.mp3
├── desc-diva-curta.mp3
├── desc-diva-longa.mp3
├── desc-paisagem-curta.mp3
├── desc-paisagem-longa.mp3
├── desc-brasil2017-curta.mp3
├── desc-brasil2017-longa.mp3
├── desc-hangar-curta.mp3
└── desc-hangar-longa.mp3
```

---

### 3.4 Implementação técnica — Audiodescrição

```typescript
// hooks/useAudiodescricao.ts
import { useRef, useCallback } from "react";

export function useAudiodescricao() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const reproduzir = useCallback((caminho: string) => {
    // Para qualquer áudio em andamento
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const audio = new Audio(caminho);
    audioRef.current = audio;
    audio.play().catch(() => {
      // Fallback: Web Speech API se arquivo não carregar
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance();
        utterance.lang = "pt-BR";
        utterance.rate = 0.9; // Levemente mais lento para clareza
        window.speechSynthesis.speak(utterance);
      }
    });
  }, []);

  const parar = useCallback(() => {
    audioRef.current?.pause();
    window.speechSynthesis?.cancel();
  }, []);

  return { reproduzir, parar };
}
```

```typescript
// Atualização em data/obras.ts — novos campos de acessibilidade
export interface Obra {
  id: string;
  titulo: string;
  artista: string;
  descricao: string;
  posicao: [number, number, number];
  cor: string;
  corEmissiva?: string;
  raioProximidade: number;
  modeloCaminho: string;
  escala?: [number, number, number];
  // NOVO — Fase 3
  acessibilidade: {
    audiodescricaoCurta: string;   // Caminho do .mp3 curto
    audiodescricaoLonga: string;   // Caminho do .mp3 longo
    textoAudiodescricaoCurta: string;  // Texto completo (fallback TTS + screen readers)
    textoAudiodescricaoLonga: string;
    videoLibras: string;           // Caminho do .mp4 em LIBRAS
    legendasVtt: string;           // Caminho do .vtt para legendas
  };
}
```

---

## 4. LIBRAS — Língua Brasileira de Sinais

### 4.1 O que é e por que importa

A LIBRAS é a língua natural da comunidade surda brasileira (reconhecida pela Lei 10.436/2002) e tem estrutura gramatical própria, independente do português escrito. Simplesmente exibir texto não é suficiente para garantir acessibilidade a pessoas surdas — é necessário oferecer o conteúdo **em LIBRAS**, seja por intérprete humano ou avatar de sinais.

### 4.2 Opções de produção de vídeo em LIBRAS

| Opção | Custo | Qualidade | Viabilidade para hackathon |
|---|---|---|---|
| Intérprete humano gravado | Alto | Máxima — comunicação real | Alta se houver acesso a intérprete |
| VLibras (avatar do governo federal) | Zero | Boa — avatar 3D oficial | Alta — API gratuita e open source |
| Hand Talk | Médio | Alta — avatar proprietário comercial | Média — requer licença |
| ProDeaf | Médio | Alta | Média |
| Gravação de intérprete voluntário (UFPE/UFPB) | Baixo | Alta | Alta com articulação prévia |

**Recomendação principal para o hackathon:** **VLibras** — desenvolvido pelo governo federal em parceria com a UFPB, é open source, gratuito, já usado em sites de órgãos públicos, e possui API de integração web. Permite converter texto em sinais em tempo real com avatar 3D.

**Recomendação de qualidade superior:** gravar vídeos com intérprete humano certificado para as 5 obras (aproximadamente 2–3 minutos por obra = ~15 minutos de vídeo total). Estudantes de Letras-LIBRAS das universidades federais do Nordeste frequentemente colaboram com projetos culturais de acessibilidade.

### 4.3 Integração com o VLibras (solução zero-custo)

O VLibras oferece dois modos de integração:

**Modo 1 — Widget (mais simples):**
```html
<!-- Adicionar ao _document.tsx ou layout.tsx -->
<div vw class="enabled">
  <div vw-access-button class="active"></div>
  <div vw-plugin-wrapper>
    <div class="vw-plugin-top-wrapper"></div>
  </div>
</div>
<script src="https://vlibras.gov.br/app/vlibras-plugin.js"></script>
<script>
  new window.VLibras.Widget("https://vlibras.gov.br/app");
</script>
```

**Modo 2 — API programática (para integração na cena 3D):**
```typescript
// hooks/useVLibras.ts
export function useVLibras() {
  const traduzir = (texto: string) => {
    // Dispara a tradução no widget VLibras ativo na página
    if (typeof window !== "undefined" && (window as any).vlibras) {
      (window as any).vlibras.translate(texto);
    }
  };
  return { traduzir };
}
```

### 4.4 Produção de vídeos próprios em LIBRAS (solução de qualidade)

Caso seja possível gravar vídeos com intérprete:

**Especificações técnicas de gravação:**
- Resolução: 1280×720px (mínimo) ou 1920×1080px
- Fundo: verde ou azul neutro (chroma key) — permite sobrepor fundos customizados na interface
- Iluminação: uniforme, sem sombras sobre o rosto e as mãos
- Enquadramento: do torso para cima, mãos sempre visíveis
- Formato de exportação: `.mp4`, H.264, ~2–4 Mbps, com faixa de legendas `.vtt` integrada

**Roteiro adaptado para sinais (estrutura recomendada para cada obra):**

Cada vídeo em LIBRAS deve seguir a estrutura:
1. **Identificação** (~5s): Nome da obra + nome do artista em soletramento manual se necessário
2. **Descrição visual** (~20s): O que é a obra, como ela aparece
3. **Contexto artístico** (~30s): Por que foi criada, o que significa
4. **Curiosidade** (~10s): Um fato marcante que prende a atenção

**Nomenclatura dos arquivos:**
```
public/videos/libras/
├── libras-locomotiva.mp4
├── libras-diva.mp4
├── libras-paisagem.mp4
├── libras-brasil2017.mp4
└── libras-hangar.mp4
```

**Legendas `.vtt` sincronizadas:**
```
public/videos/legendas/
├── legenda-locomotiva.vtt
├── legenda-diva.vtt
├── legenda-paisagem.vtt
├── legenda-brasil2017.vtt
└── legenda-hangar.vtt
```

**Exemplo de arquivo `.vtt`:**
```vtt
WEBVTT

00:00:01.000 --> 00:00:05.000
LOCOMOTIVA HISTÓRICA
Artista: Acervo da Usina Santa Terezinha

00:00:06.000 --> 00:00:15.000
Uma locomotiva a vapor do início do século XX
marca a entrada do parque como monumento da história.

00:00:16.000 --> 00:00:30.000
Ela transportou cana-de-açúcar pela usina
desde 1929 até o fechamento da produção industrial.
```

---

### 4.5 Componente de painel LIBRAS na cena 3D

```typescript
// components/ui/PainelLibras.tsx
import { useState, useRef } from "react";

interface Props {
  obraId: string;
  videoSrc: string;
  legendasSrc: string;
  textoDescricao: string;
}

export function PainelLibras({ obraId, videoSrc, legendasSrc, textoDescricao }: Props) {
  const [aberto, setAberto] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const abrir = () => {
    setAberto(true);
    // Pequeno delay para o DOM montar antes de iniciar
    setTimeout(() => videoRef.current?.play(), 100);
  };

  const fechar = () => {
    setAberto(false);
    videoRef.current?.pause();
    if (videoRef.current) videoRef.current.currentTime = 0;
  };

  return (
    <>
      {/* Botão de acesso — dentro do painel flutuante existente da Fase 1/2 */}
      <button
        onClick={abrir}
        aria-label="Ver descrição em LIBRAS"
        className="btn-libras"
      >
        {/* Ícone de mãos em LIBRAS — pode ser SVG customizado */}
        🤟 LIBRAS
      </button>

      {/* Modal de vídeo — renderizado fora do Canvas R3F, em overlay HTML */}
      {aberto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Descrição em LIBRAS — ${obraId}`}
          className="libras-modal"
        >
          <button
            onClick={fechar}
            aria-label="Fechar vídeo LIBRAS"
            className="libras-modal-close"
          >
            ✕
          </button>

          <video
            ref={videoRef}
            width="400"
            height="300"
            controls
            playsInline
            aria-describedby={`desc-libras-${obraId}`}
          >
            <source src={videoSrc} type="video/mp4" />
            <track
              kind="subtitles"
              src={legendasSrc}
              srcLang="pt"
              label="Português"
              default
            />
            Seu navegador não suporta reprodução de vídeo.
          </video>

          {/* Texto da descrição para screen readers — visualmente oculto */}
          <p
            id={`desc-libras-${obraId}`}
            className="sr-only"
          >
            {textoDescricao}
          </p>
        </div>
      )}
    </>
  );
}
```

---

## 5. Componente unificado de acessibilidade no painel da obra

O painel informativo flutuante da Fase 1 (World Space Canvas) e a UI HTML da Fase 2 ganham uma **barra de acessibilidade** padronizada:

```typescript
// components/ui/BarraAcessibilidade.tsx
import { useAudiodescricao } from "@/hooks/useAudiodescricao";
import { PainelLibras } from "./PainelLibras";
import { Obra } from "@/data/obras";

interface Props {
  obra: Obra;
  modoAudiodescricaoAtivo: boolean;
}

export function BarraAcessibilidade({ obra, modoAudiodescricaoAtivo }: Props) {
  const { reproduzir, parar } = useAudiodescricao();
  const [descricaoExpandida, setDescricaoExpandida] = useState(false);

  // Reproduz automaticamente se modo DV estiver ativo
  useEffect(() => {
    if (modoAudiodescricaoAtivo) {
      reproduzir(obra.acessibilidade.audiodescricaoCurta);
    }
    return () => parar();
  }, [obra.id, modoAudiodescricaoAtivo]);

  return (
    <div
      className="barra-acessibilidade"
      role="complementary"
      aria-label="Recursos de acessibilidade"
    >
      {/* Audiodescrição */}
      <button
        onClick={() => reproduzir(obra.acessibilidade.audiodescricaoCurta)}
        aria-label="Ouvir audiodescrição desta obra"
        title="Audiodescrição"
      >
        🔊 Audiodescrição
      </button>

      <button
        onClick={() => {
          setDescricaoExpandida(!descricaoExpandida);
          if (!descricaoExpandida) {
            reproduzir(obra.acessibilidade.audiodescricaoLonga);
          }
        }}
        aria-expanded={descricaoExpandida}
        aria-label="Audiodescrição detalhada desta obra"
      >
        📖 Descrição detalhada
      </button>

      {/* LIBRAS */}
      <PainelLibras
        obraId={obra.id}
        videoSrc={obra.acessibilidade.videoLibras}
        legendasSrc={obra.acessibilidade.legendasVtt}
        textoDescricao={obra.acessibilidade.textoAudiodescricaoCurta}
      />

      {/* Texto expandido para leitores de tela */}
      {descricaoExpandida && (
        <div
          aria-live="polite"
          className="descricao-expandida"
        >
          <p>{obra.acessibilidade.textoAudiodescricaoLonga}</p>
        </div>
      )}
    </div>
  );
}
```

---

## 6. Melhorias gerais de acessibilidade na interface

### 6.1 Navegação por teclado na cena 3D

A navegação padrão WASD deve ser complementada com:

```typescript
// hooks/useNavegacaoAcessivel.ts
// Permite que usuários sem mouse naveguem pela cena

useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    switch (e.key) {
      case "Tab":
        // Percorre os pontos de interesse sequencialmente
        irParaProximaObra();
        break;
      case "Enter":
      case " ":
        // Abre painel da obra em foco
        abrirPainelObra();
        break;
      case "Escape":
        // Fecha qualquer painel aberto
        fecharPaineis();
        break;
      case "F1":
        // Lê em voz alta as instruções de navegação
        lerInstrucoes();
        break;
    }
  };
  window.addEventListener("keydown", handler);
  return () => window.removeEventListener("keydown", handler);
}, []);
```

### 6.2 ARIA labels na cena 3D (HTML overlay)

```typescript
// Wrapping do Canvas com contexto semântico
<main
  role="main"
  aria-label="Museu virtual UsinaVR — Percurso interativo pelo acervo da Usina de Arte"
>
  <Canvas>
    {/* cena 3D */}
  </Canvas>

  {/* Navegação acessível por pontos de interesse */}
  <nav
    aria-label="Pontos de interesse do museu"
    className="sr-only"  // visualmente oculta, presente para leitores de tela
  >
    <ul>
      {obras.map(obra => (
        <li key={obra.id}>
          <button
            onClick={() => navegarParaObra(obra.id)}
            aria-label={`Ir para: ${obra.titulo}, de ${obra.artista}`}
          >
            {obra.titulo}
          </button>
        </li>
      ))}
    </ul>
  </nav>
</main>
```

### 6.3 Modo alto contraste

```css
/* globals.css — adicionado na Fase 3 */
@media (prefers-contrast: high) {
  :root {
    --cor-painel-fundo: #000000;
    --cor-painel-texto: #ffffff;
    --cor-painel-borda: #ffff00;
    --cor-botao: #ffff00;
    --cor-botao-texto: #000000;
  }
}

/* Modo manual via toggle */
[data-tema="alto-contraste"] {
  --cor-painel-fundo: #000000;
  --cor-painel-texto: #ffffff;
  --cor-painel-borda: #ffff00;
}
```

### 6.4 Escala de fonte ajustável

```typescript
// components/ui/PainelAcessibilidade.tsx
// Painel flutuante de configurações de acessibilidade (canto superior direito)

export function PainelAcessibilidade() {
  const [tamanhoFonte, setTamanhoFonte] = useState(16);
  const [altoContraste, setAltoContraste] = useState(false);
  const [audiodescricaoAtiva, setAudiodescricaoAtiva] = useState(false);
  const [librasAtivoPadrao, setLibrasAtivoPadrao] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = `${tamanhoFonte}px`;
  }, [tamanhoFonte]);

  useEffect(() => {
    document.documentElement.dataset.tema = altoContraste ? "alto-contraste" : "";
  }, [altoContraste]);

  return (
    <aside
      aria-label="Configurações de acessibilidade"
      role="complementary"
    >
      <h2>♿ Acessibilidade</h2>

      <label>
        Tamanho do texto
        <input
          type="range"
          min={12}
          max={28}
          value={tamanhoFonte}
          onChange={e => setTamanhoFonte(Number(e.target.value))}
          aria-valuetext={`${tamanhoFonte} pixels`}
        />
      </label>

      <label>
        <input
          type="checkbox"
          checked={altoContraste}
          onChange={e => setAltoContraste(e.target.checked)}
        />
        Alto contraste
      </label>

      <label>
        <input
          type="checkbox"
          checked={audiodescricaoAtiva}
          onChange={e => setAudiodescricaoAtiva(e.target.checked)}
        />
        Audiodescrição automática ao se aproximar das obras
      </label>

      <label>
        <input
          type="checkbox"
          checked={librasAtivoPadrao}
          onChange={e => setLibrasAtivoPadrao(e.target.checked)}
        />
        Abrir LIBRAS automaticamente ao ver obras
      </label>
    </aside>
  );
}
```

---

## 7. Estrutura de arquivos adicionada na Fase 3

```
UsinaVR/
├── public/
│   ├── audio/
│   │   ├── desc-locomotiva-curta.mp3
│   │   ├── desc-locomotiva-longa.mp3
│   │   ├── desc-diva-curta.mp3
│   │   ├── desc-diva-longa.mp3
│   │   ├── desc-paisagem-curta.mp3
│   │   ├── desc-paisagem-longa.mp3
│   │   ├── desc-brasil2017-curta.mp3
│   │   ├── desc-brasil2017-longa.mp3
│   │   ├── desc-hangar-curta.mp3
│   │   └── desc-hangar-longa.mp3
│   └── videos/
│       ├── libras/
│       │   ├── libras-locomotiva.mp4
│       │   ├── libras-diva.mp4
│       │   ├── libras-paisagem.mp4
│       │   ├── libras-brasil2017.mp4
│       │   └── libras-hangar.mp4
│       └── legendas/
│           ├── legenda-locomotiva.vtt
│           ├── legenda-diva.vtt
│           ├── legenda-paisagem.vtt
│           ├── legenda-brasil2017.vtt
│           └── legenda-hangar.vtt
├── src/
│   ├── hooks/
│   │   ├── useAudiodescricao.ts      # NOVO
│   │   ├── useVLibras.ts             # NOVO
│   │   └── useNavegacaoAcessivel.ts  # NOVO
│   └── components/
│       └── ui/
│           ├── BarraAcessibilidade.tsx  # NOVO
│           ├── PainelLibras.tsx         # NOVO
│           └── PainelAcessibilidade.tsx # NOVO
└── data/
    └── obras.ts   # ATUALIZADO com campo acessibilidade{}
```

---

## 8. Checklist de conformidade com padrões

| Padrão / Norma | Requisito | Implementado |
|---|---|---|
| WCAG 2.1 AA | Contraste mínimo 4.5:1 nos textos | ☐ CSS alto contraste |
| WCAG 2.1 AA | Todos os controles operáveis por teclado | ☐ useNavegacaoAcessivel |
| WCAG 2.1 AA | Conteúdo multimídia com alternativa textual | ☐ textoAudiodescricao + .vtt |
| WCAG 2.1 AA | Conteúdo em áudio com legendas | ☐ faixas .vtt nos vídeos |
| LBI Art. 63 | Audiodescrição de conteúdo visual | ☐ arquivos .mp3 + TTS fallback |
| Decreto 5.626 | Conteúdo informativo disponível em LIBRAS | ☐ vídeos .mp4 ou VLibras API |
| ABNT NBR 15290 | Roteiro de audiodescrição com descrição concisa e estendida | ☐ dois níveis por obra |

---

## 9. Plano de validação com usuários reais

A entrega técnica só está completa quando validada por pessoas dos grupos atendidos. Sugestões de validação viáveis no contexto do hackathon:

| Ação | Recurso necessário | Prazo |
|---|---|---|
| Teste com usuário DV (cegueira total) usando leitor de tela NVDA + navegação por teclado | 1 voluntário + 1h de sessão | Dia 12 |
| Teste com usuário surdo avaliando fluência e clareza do vídeo LIBRAS | 1 voluntário surdo ou intérprete | Dia 13 |
| Teste com usuário com baixa visão verificando alto contraste e escala de fonte | 1 voluntário + 30min | Dia 13 |
| Revisão do roteiro LIBRAS por intérprete certificado (Prolibras) | 1 intérprete | Antes da gravação |

**Contatos sugeridos para parcerias:**
- **UFPE** — Letras-LIBRAS e Núcleo de Acessibilidade (NACE)
- **IFPE** — Curso de Tradução e Interpretação em Libras
- **Associação de Surdos de Pernambuco (ASSPE)** — voluntários para testes

---

## 10. Cronograma sugerido (Fase 3 — 2 semanas)

| Período | Entrega |
|---|---|
| Dias 1–2 | Estruturar os campos de acessibilidade em `obras.ts`; criar componentes `BarraAcessibilidade` e `PainelLibras` (UI sem conteúdo ainda) |
| Dias 3–4 | Escrever todos os 10 roteiros de audiodescrição (5 obras × 2 níveis); revisar com pessoa DV se possível |
| Dias 5–6 | Gravar ou gerar as audiodescrições (ElevenLabs ou intérprete); normalizar e exportar os `.mp3` |
| Dias 7–8 | Produzir os vídeos em LIBRAS (VLibras API ou gravação com intérprete); criar arquivos `.vtt` de legenda |
| Dias 9–10 | Integrar todos os arquivos aos componentes React; implementar modal de preferências inicial |
| Dias 11–12 | Implementar navegação por teclado, ARIA labels e modo alto contraste |
| Dias 13 | Sessões de teste com usuários reais dos grupos-alvo |
| Dia 14 | Ajustes finais baseados no feedback; deploy na Vercel; atualizar README com seção de acessibilidade |

---

## 11. Atualização do README

A seção de acessibilidade deve ser adicionada ao `README.md`:

```markdown
## Acessibilidade

O UsinaVR foi desenvolvido com acessibilidade como prioridade estrutural,
não como recurso adicional.

### Para pessoas com deficiência visual
- **Audiodescrição** de cada obra em dois níveis: descrição concisa
  (automática ao se aproximar) e descrição estendida (sob demanda).
- **Fallback Text-to-Speech** via Web Speech API caso o arquivo de áudio
  não carregue.
- **Navegação por teclado** completa: Tab para percorrer obras,
  Enter para abrir painel, F1 para instruções de navegação.
- **Compatível com leitores de tela** NVDA e VoiceOver (ARIA labels
  em todos os controles interativos).

### Para pessoas com deficiência auditiva
- **Vídeo em LIBRAS** disponível para cada obra, acessível pelo botão
  "🤟 LIBRAS" no painel informativo.
- **Legendas sincronizadas** (.vtt) em todos os vídeos.
- **Modo LIBRAS padrão** ativável no painel de preferências.

### Configurações globais
- **Alto contraste** (automático via `prefers-contrast` ou toggle manual).
- **Escala de fonte ajustável** de 12px a 28px.
- **Modal de preferências** na entrada do museu para configuração inicial.

### Conformidade
Este projeto busca conformidade com WCAG 2.1 nível AA, a Lei Brasileira
de Inclusão (Lei 13.146/2015) e o Decreto 5.626/2005 sobre LIBRAS.
```

---

## 12. Recursos de referência

- [VLibras — Suíte de ferramentas do governo federal](https://vlibras.gov.br)
- [WCAG 2.1 em português — W3C Brasil](https://www.w3c.br/traducoes/wcag/wcag21-pt-BR/)
- [Lei Brasileira de Inclusão — Lei 13.146/2015](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm)
- [Decreto 5.626/2005 — Regulamentação da LIBRAS](https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2005/decreto/d5626.htm)
- [ABNT NBR 15290 — Acessibilidade em comunicação na televisão](https://www.abnt.org.br)
- [Web Speech API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [ElevenLabs TTS — pt-BR](https://elevenlabs.io)
- [React Three Fiber — HTML Overlay (R3F + DOM)](https://docs.pmnd.rs/react-three-fiber/tutorials/v8-migration-guide#html-portal)
- [Galeria oficial — Usina de Arte](https://www.usinadearte.org)

---

*Planejamento elaborado para a Fase 3 do UsinaVR — Hackweb Web3 / RESTIC 29*
