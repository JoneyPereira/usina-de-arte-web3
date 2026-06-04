# Planejamento MVP — UsinaVR Fase 2 (Revisão): Billboard Fotográfico

**Projeto:** UsinaVR — Museu Digital Imersivo  
**Hackathon:** Hackweb Web3 — RESTIC 29 / Desafio ExpoVerse  
**Aluno:** Joney Sousa Pereira  
**Fase:** 2 — Revisão para Hardware Modesto  
**Motivação da revisão:** Hardware de desenvolvimento com NVIDIA G210 (973 MB VRAM) inviabiliza o carregamento e renderização de modelos glTF com PBR. Esta versão substitui os `.glb` por **billboards fotográficos** (sprites planos com foto real da obra), mantendo **toda a arquitetura funcional** — navegação, proximidade, painéis informativos, interações e sistema de gatilhos — com custo de GPU mínimo.

---

## 1. Diagnóstico de Hardware e Impacto

| Componente | Sua Máquina | Mínimo para glTF+PBR | Status |
|---|---|---|---|
| GPU | NVIDIA G210 (973 MB VRAM) | 2 GB VRAM, WebGL 2 | ❌ Insuficiente |
| CPU | Xeon E5-2670 v3 @ 2.30GHz | Qualquer multi-core | ✅ OK |
| RAM | 16 GB | 8 GB | ✅ OK |
| Armazenamento | SSD 238 GB + HDD 932 GB | SSD recomendado | ✅ OK |

**Problema específico da G210:** Esta GPU é de 2009, baseada na arquitetura Tesla (não confundir com a marca Tesla). Ela suporta apenas OpenGL 3.3 / DirectX 10.1 e tem suporte WebGL 1 limitado e WebGL 2 ausente. Tentativas de renderizar `MeshPhysicalMaterial`, pós-processamento (SSAO, Bloom) e sombras dinâmicas resultarão em travamentos ou ausência de imagem.

**Estratégia adotada:** Substituir os modelos 3D por `<Billboard>` do Drei — planos que sempre encaram a câmera, exibindo uma imagem JPG/WebP da obra real. O resultado visual é diferente do glTF, mas honesto e funcional, além de ter custo de renderização próximo de zero.

---

## 2. O que muda e o que permanece

### ✅ Permanece igual (zero alteração necessária)

- Arquitetura de componentes React Three Fiber
- Arquivo central `data/obras.ts` (apenas adicionar campo `fotoCaminho`)
- Sistema de proximidade com Zustand (`GATILHOS_CARREGAMENTO.md`)
- Painéis informativos flutuantes ao se aproximar
- Interação de destaque ao clicar (troca de material/borda)
- Gatilhos de carregamento por distância (`GerenciadorProximidade`)
- Navegação WASD + mouse
- Deploy na Vercel
- Suporte WebXR (opcional, mantido)

### 🔄 O que muda

| Antes (Fase 2 glTF) | Agora (Fase 2 Billboard) |
|---|---|
| Modelo `.glb` com PBR | Imagem JPG/WebP em `<Billboard>` |
| Blender para modelagem | Nenhuma ferramenta extra necessária |
| `useGLTF()` | `useTexture()` |
| `MeshPhysicalMaterial` | `MeshBasicMaterial` (sem luz) |
| Sombras dinâmicas | Sombra falsa (círculo escuro no chão) |
| SSAO + Bloom | Sem pós-processamento |
| 400–800 KB por obra | 80–150 KB por foto (WebP otimizado) |

---

## 3. Conceito: Billboard Fotográfico

Um **billboard** (ou sprite) é um plano 3D que **sempre rotaciona para encarar a câmera**, independente da direção em que o usuário olha. É a técnica usada em jogos clássicos como Doom e Wolfenstein para árvores e personagens.

No contexto do UsinaVR, cada obra será representada por:

1. Um **plano vertical** com a foto da obra aplicada como textura
2. Um **suporte** (pedestal fino) conectando o plano ao chão, dando sensação de instalação
3. Uma **sombra falsa** (elipse escura semi-transparente no chão) para ancorá-la visualmente
4. O **painel informativo** flutuante já existente, ativado por proximidade

```
        ┌────────────────────┐
        │   [FOTO DA OBRA]   │  ← PlaneGeometry com useTexture()
        │                    │     sempre encarando a câmera
        └────────┬───────────┘
                 │  ← pedestal (cilindro fino)
        ░░░░░░░░░░░░░░░░░░░  ← sombra falsa (elipse no chão)
```

---

## 4. Atualização do arquivo `data/obras.ts`

Adicionar apenas o campo `fotoCaminho` à interface já existente:

```typescript
// data/obras.ts
export interface Obra {
  id: string;
  titulo: string;
  artista: string;
  descricao: string;
  posicao: [number, number, number];
  cor: string;               // Cor de fallback se foto não carregar
  corEmissiva?: string;
  raioProximidade: number;
  fotoCaminho: string;       // NOVO: "/fotos/locomotiva.webp"
  alturaDisplay?: number;    // NOVO: altura do billboard em metros (padrão: 3)
  larguraDisplay?: number;   // NOVO: largura do billboard em metros (padrão: 2.5)
}

export const obras: Obra[] = [
  {
    id: "locomotiva",
    titulo: "Locomotiva Histórica",
    artista: "Acervo Usina Santa Terezinha",
    descricao: "Locomotiva a vapor da era áurea da cana-de-açúcar na Zona da Mata Sul. Marco de entrada do parque artístico-botânico.",
    posicao: [0, 0, -10],
    cor: "#2a2a2a",
    raioProximidade: 5,
    fotoCaminho: "/fotos/locomotiva.webp",
    alturaDisplay: 2.5,
    larguraDisplay: 4,
  },
  {
    id: "diva",
    titulo: "Diva",
    artista: "Juliana Notari",
    descricao: "Escultura monumental de 33m em poliuretano e fibra de vidro. Rasgo vulvar vermelho-vivo na encosta de uma colina — uma das obras mais icônicas do acervo.",
    posicao: [30, 2, -40],
    cor: "#c0392b",
    raioProximidade: 8,
    fotoCaminho: "/fotos/diva.webp",
    alturaDisplay: 5,
    larguraDisplay: 4,
  },
  {
    id: "paisagem",
    titulo: "Paisagem",
    artista: "Regina Silveira",
    descricao: "Labirinto de 59 vidros industriais marcados por tiros de espingarda. A violência transformada em poética visual.",
    posicao: [60, 0, -55],
    cor: "#d6eaf8",
    raioProximidade: 6,
    fotoCaminho: "/fotos/paisagem.webp",
    alturaDisplay: 3,
    larguraDisplay: 3.5,
  },
  {
    id: "brasil2017",
    titulo: "Brasil 2017",
    artista: "Paulo Bruscky",
    descricao: "Instalação de arte postal e conceitual. Envelopes, carimbos e documentos constroem um comentário político sobre o Brasil de 2017.",
    posicao: [90, 0, -45],
    cor: "#c0392b",
    raioProximidade: 5,
    fotoCaminho: "/fotos/brasil2017.webp",
    alturaDisplay: 2.8,
    larguraDisplay: 3,
  },
  {
    id: "hangar-rufino",
    titulo: "Hangar José Rufino",
    artista: "José Rufino",
    descricao: "Instalação de facões suspensos e documentos dentro do hangar histórico da Usina. Memória da cultura sucroalcooleira de Pernambuco.",
    posicao: [120, 0, -30],
    cor: "#7f8c8d",
    raioProximidade: 8,
    fotoCaminho: "/fotos/hangar-rufino.webp",
    alturaDisplay: 4,
    larguraDisplay: 5,
  },
];
```

---

## 5. Componente `ObraFoto.tsx` (substitui `ModeloObra.tsx`)

```typescript
// components/scene/obras/ObraFoto.tsx
import { Billboard, useTexture } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";
import { GroupProps } from "@react-three/fiber";

interface Props extends GroupProps {
  fotoCaminho: string;
  cor: string;            // Cor de fallback
  altura?: number;        // Altura do billboard em metros
  largura?: number;       // Largura do billboard em metros
  destacado?: boolean;    // Estado de destaque (após clique)
  aoClicar?: () => void;
}

export function ObraFoto({
  fotoCaminho,
  cor,
  altura = 3,
  largura = 2.5,
  destacado = false,
  aoClicar,
  ...props
}: Props) {
  const textura = useTexture(fotoCaminho);
  const [hovered, setHovered] = useState(false);

  // Cor da borda: normal = branco, hover = amarelo, destacado = laranja
  const corBorda = destacado
    ? "#ff8c00"
    : hovered
    ? "#ffe066"
    : "#ffffff";

  return (
    <group {...props}>
      {/* Billboard: plano que sempre encarar a câmera */}
      <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
        {/* Foto da obra */}
        <mesh
          onClick={aoClicar}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <planeGeometry args={[largura, altura]} />
          <meshBasicMaterial
            map={textura}
            side={THREE.DoubleSide}
            transparent={true}
          />
        </mesh>

        {/* Borda decorativa (frame) — 4 barras finas ao redor da foto */}
        {[
          // [posX, posY, largura, altura] — top, bottom, left, right
          [0, altura / 2 + 0.03, largura + 0.06, 0.06],
          [0, -(altura / 2 + 0.03), largura + 0.06, 0.06],
          [-(largura / 2 + 0.03), 0, 0.06, altura + 0.06],
          [largura / 2 + 0.03, 0, 0.06, altura + 0.06],
        ].map(([px, py, w, h], i) => (
          <mesh key={i} position={[px as number, py as number, -0.01]}>
            <planeGeometry args={[w as number, h as number]} />
            <meshBasicMaterial color={corBorda} />
          </mesh>
        ))}
      </Billboard>

      {/* Pedestal: cilindro fino do chão até a base do billboard */}
      <mesh position={[0, -(altura / 2) - 0.6, 0]}>
        <cylinderGeometry args={[0.04, 0.06, altura / 2, 6]} />
        <meshBasicMaterial color="#888888" />
      </mesh>

      {/* Sombra falsa no chão — elipse escura semi-transparente */}
      <mesh
        position={[0, -(altura / 2) - altura / 4 - 0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[largura * 0.4, 16]} />
        <meshBasicMaterial
          color="#000000"
          transparent={true}
          opacity={0.25}
        />
      </mesh>

      {/* Fallback: se a textura falhar, mostra plano colorido */}
      {/* (useTexture usa Suspense — o fallback é o ErrorBoundary do componente pai) */}
    </group>
  );
}

// Pré-carregamento das fotos principais
export function precarregarFotos(caminhos: string[]) {
  caminhos.forEach((c) => useTexture.preload(c));
}
```

---

## 6. Integração com o sistema de proximidade (sem alteração)

O `GerenciadorProximidade.jsx` dos arquivos `GATILHOS_CARREGAMENTO.md` **permanece idêntico**. A única diferença é que, em vez de chamar `useGLTF.preload(url)` na zona de preload, chamamos `useTexture.preload(url)`:

```javascript
// Em useUsinaStore.js — troca apenas esta linha:

// ANTES (glTF):
useGLTF.preload(obra.url);

// DEPOIS (foto):
useTexture.preload(obra.fotoCaminho);
```

O `obrasCadastro` no store passa a referenciar `fotoCaminho` em vez de `url`:

```javascript
obrasCadastro: [
  { id: '1', nome: 'Locomotiva', fotoCaminho: '/fotos/locomotiva.webp', posicao: [0, 0, -10] },
  { id: '2', nome: 'Diva',       fotoCaminho: '/fotos/diva.webp',       posicao: [30, 2, -40] },
  // ...
],
```

---

## 7. Componente completo da cena principal

```typescript
// components/scene/Mapa3D.tsx
import { Suspense } from "react";
import { Html, useProgress } from "@react-three/drei";
import { useUsinaStore } from "@/store/useUsinaStore";
import { GerenciadorProximidade } from "./GerenciadorProximidade";
import { ObraFoto } from "./obras/ObraFoto";
import { PainelInfo } from "./PainelInfo";
import { obras } from "@/data/obras";

function LoadingObra() {
  return null; // Sem indicador — a cena já existe, obras surgem silenciosamente
}

export function Mapa3D() {
  const obrasAtivas = useUsinaStore((state) => state.obrasAtivas);
  const obraDestacada = useUsinaStore((state) => state.obraDestacada);
  const setObraDestacada = useUsinaStore((state) => state.setObraDestacada);

  return (
    <group>
      <GerenciadorProximidade />

      {obras.map((obra) => {
        if (!obrasAtivas.includes(obra.id)) return null;

        return (
          <Suspense key={obra.id} fallback={<LoadingObra />}>
            <ObraFoto
              fotoCaminho={obra.fotoCaminho}
              cor={obra.cor}
              altura={obra.alturaDisplay ?? 3}
              largura={obra.larguraDisplay ?? 2.5}
              position={obra.posicao}
              destacado={obraDestacada === obra.id}
              aoClicar={() =>
                setObraDestacada(obraDestacada === obra.id ? null : obra.id)
              }
            />
            <PainelInfo
              obra={obra}
              raio={obra.raioProximidade}
              position={obra.posicao}
            />
          </Suspense>
        );
      })}
    </group>
  );
}
```

---

## 8. Otimização das imagens para hardware modesto

A G210 tem apenas 973 MB de VRAM total. Com 5 obras, o orçamento de textura é generoso, mas é boa prática manter as imagens leves:

| Obra | Resolução recomendada | Formato | Tamanho alvo |
|---|---|---|---|
| Locomotiva | 1024 × 768 px | WebP (qualidade 80) | ≤ 120 KB |
| Diva | 1024 × 1280 px | WebP (qualidade 80) | ≤ 150 KB |
| Paisagem | 1024 × 1024 px | WebP (qualidade 80) | ≤ 110 KB |
| Brasil 2017 | 1024 × 768 px | WebP (qualidade 75) | ≤ 100 KB |
| Hangar Rufino | 1280 × 960 px | WebP (qualidade 80) | ≤ 140 KB |
| **Total** | | | **≤ 620 KB** |

### Converter para WebP no terminal (usando cwebp ou ffmpeg):

```bash
# Instalar cwebp (Ubuntu/WSL):
sudo apt install webp

# Converter todas as fotos da pasta /fotos de uma vez:
for f in public/fotos/*.jpg; do
  cwebp -q 80 "$f" -o "${f%.jpg}.webp"
done
```

### Estrutura de pastas para as fotos:

```
public/
└── fotos/
    ├── locomotiva.webp
    ├── diva.webp
    ├── paisagem.webp
    ├── brasil2017.webp
    └── hangar-rufino.webp
```

**Onde obter as fotos:**
- Site oficial da Usina de Arte: https://www.usinadearte.org
- Página no Instagram: @usinadearte
- Wikimedia Commons (buscar por "Usina de Arte Água Preta")
- Fotografar durante visita ao local

> **Nota legal:** Para o hackathon, fotos de uso educacional/não-comercial são aceitáveis. Para deploy público permanente, solicitar autorização formal à Usina de Arte ou usar fotos de licença livre (CC BY).

---

## 9. Configuração do Canvas para hardware modesto

Desabilitar todos os recursos que sobrecarregam a G210:

```typescript
// app/museu/page.tsx ou CanvasContainer3D.tsx
import { Canvas } from "@react-three/fiber";

export function CanvasContainer3D() {
  return (
    <Canvas
      // NÃO habilitar shadows — custoso demais para G210
      shadows={false}
      
      // Limitar pixel ratio para não sobrecarregar VRAM
      dpr={[1, 1.5]}   // Máximo 1.5x (em vez de window.devicePixelRatio)
      
      // WebGL 1 compatível (G210 não tem WebGL 2 confiável)
      gl={{
        antialias: false,        // Desligar antialiasing — economiza VRAM
        alpha: false,
        powerPreference: "low-power",
        failIfMajorPerformanceCaveat: false,
      }}
      
      camera={{ fov: 75, near: 0.1, far: 500 }}
    >
      {/* Iluminação simples — sem sombras dinâmicas */}
      <ambientLight intensity={1.2} color="#ffecd2" />
      {/* Sem directionalLight com castShadow */}
      
      <Mapa3D />
    </Canvas>
  );
}
```

---

## 10. Remoção do pós-processamento

O arquivo `OTIMIZACAO_WEB3D.md` menciona SSAO e Bloom via `@react-three/postprocessing`. **Não instalar nem importar este pacote** — ele cria um pipeline de renderização multi-pass que a G210 não suporta.

```typescript
// NÃO incluir no projeto (incompatível com G210):
// import { EffectComposer, SSAO, Bloom } from "@react-three/postprocessing"

// Substituto: efeito de "brilho" nas obras destacadas via cor emissiva no material
// (custo zero — apenas troca a cor do MeshBasicMaterial)
```

---

## 11. Checklist comparativo com o planejamento glTF original

| Item | Planejamento glTF | Esta revisão | Status |
|---|---|---|---|
| 5 obras representadas na cena | Modelos `.glb` PBR | Fotos WebP em billboard | ✅ Equivalente |
| Navegação pelo percurso | WASD + mouse | WASD + mouse | ✅ Idêntico |
| Painel informativo por proximidade | Trigger + Canvas R3F | Trigger + Canvas R3F | ✅ Idêntico |
| Destaque ao clicar na obra | Troca de material emissivo | Troca de cor da borda | ✅ Equivalente |
| Sistema de gatilho por distância | Zustand + GerenciadorProximidade | Zustand + GerenciadorProximidade | ✅ Idêntico |
| Carregamento sob demanda | `useGLTF` + Suspense | `useTexture` + Suspense | ✅ Equivalente |
| Preload na zona de 75m | `useGLTF.preload()` | `useTexture.preload()` | ✅ Equivalente |
| Sombras dinâmicas | castShadow + SoftShadows | Sombra falsa (círculo) | ⚠️ Simplificado |
| SSAO + Bloom | postprocessing | Removido | ⚠️ Removido |
| Modelagem Blender | Necessário | Não necessário | ✅ Simplificado |
| Compatibilidade G210 | ❌ Travaria | ✅ Roda fluido | ✅ Resolvido |

---

## 12. Cronograma sugerido (Fase 2 revisada — 1 semana)

| Dia | Entrega |
|---|---|
| Dia 1 | Coletar e otimizar as 5 fotos das obras (WebP, resolução adequada) |
| Dia 2 | Criar `ObraFoto.tsx` com billboard, pedestal e sombra falsa |
| Dia 3 | Atualizar `data/obras.ts` com `fotoCaminho` + `alturaDisplay` |
| Dia 4 | Integrar com `Mapa3D.tsx` + sistema Zustand existente |
| Dia 5 | Ajustar `PainelInfo` para funcionar com nova arquitetura |
| Dia 6 | Configurar Canvas com parâmetros para baixo consumo de GPU |
| Dia 7 | Testes de performance, ajustes, deploy na Vercel |

---

## 13. Checklist de entrega da Fase 2 (revisada)

- [ ] Pasta `public/fotos/` com 5 imagens WebP otimizadas (≤ 150 KB cada)
- [ ] Componente `ObraFoto.tsx` com billboard, borda, pedestal e sombra falsa
- [ ] `data/obras.ts` atualizado com campos `fotoCaminho`, `alturaDisplay`, `larguraDisplay`
- [ ] `useUsinaStore.js` ajustado para usar `useTexture.preload` (troca de 1 linha)
- [ ] Canvas configurado com `shadows={false}`, `dpr={[1, 1.5]}`, `antialias: false`
- [ ] Sem importação de `@react-three/postprocessing`
- [ ] Navegação, proximidade e painéis informativos funcionando
- [ ] Destaque visual ao clicar na obra (borda laranja)
- [ ] README atualizado com captura de tela e nota sobre abordagem billboard
- [ ] Deploy na Vercel funcionando

---

## 14. Nota para atualização futura do hardware

Quando você adquirir uma GPU mais moderna (qualquer placa com 4 GB VRAM e suporte a WebGL 2, como uma RX 580, GTX 1060 ou equivalente), a migração de billboard para glTF é **aditiva, não substitutiva**:

1. Manter o campo `fotoCaminho` em `obras.ts` (usado como fallback)
2. Adicionar o campo `modeloCaminho` apontando para o `.glb`
3. No componente, verificar se `modeloCaminho` existe: se sim, renderiza o modelo; se não, renderiza o billboard

```typescript
// Migração futura — zero quebra na arquitetura:
{obra.modeloCaminho ? (
  <ModeloObra caminho={obra.modeloCaminho} position={obra.posicao} />
) : (
  <ObraFoto fotoCaminho={obra.fotoCaminho} position={obra.posicao} />
)}
```

Esta separação de responsabilidades é justamente o que torna uma arquitetura de dados centralizada (`obras.ts`) vantajosa.

---

*Planejamento revisado para hardware modesto — UsinaVR / Hackweb Web3 / RESTIC 29*  
*Revisão motivada por limitação de GPU (NVIDIA G210, 973 MB VRAM)*
