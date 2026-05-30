# Planejamento MVP — UsinaVR Fase 2: Modelos glTF e Realismo Visual

**Projeto:** UsinaVR — Museu Digital Imersivo  
**Hackathon:** Hackweb Web3 — RESTIC 29 / Desafio ExpoVerse  
**Aluno:** Joney Sousa Pereira  
**Fase:** 2 — Upgrade de Realismo com glTF/WebGL  
**Base:** Continuação da branch `feature/modelo-inicial`

---

## 1. Objetivo desta fase

A Fase 1 estabeleceu a arquitetura funcional do projeto com geometrias primitivas (`BoxGeometry`, `CylinderGeometry` etc.). O objetivo da Fase 2 é elevar o realismo visual substituindo os primitivos por **modelos 3D criados no Blender e exportados no formato glTF 2.0 (`.glb`)**, aproveitando os recursos do pipeline WebGL que o React Three Fiber já expõe: PBR materials (Physically Based Rendering), normal maps, ambient occlusion e shadow casting.

O resultado esperado é uma experiência visivelmente mais imersiva, mantendo a mesma arquitetura de componentes e o arquivo central `data/obras.ts` da fase anterior.

---

## 2. Por que glTF?

| Critério | Primitivos (Fase 1) | glTF 2.0 (Fase 2) |
|---|---|---|
| Realismo visual | Baixo — formas geométricas simples | Alto — meshes detalhados + PBR |
| Workflow de criação | Direto no código | Blender → Export → `useGLTF()` |
| Tamanho de arquivo | Mínimo | Controlável com Draco compression |
| Suporte no browser | Nativo | Nativo via Three.js / R3F |
| Animações | Manual (via `useFrame`) | Embutidas no `.glb` (AnimationMixer) |
| Materiais | `MeshStandardMaterial` manual | PBR completo exportado do Blender |

O formato **`.glb`** (binário do glTF) é preferido ao `.gltf` + pasta de texturas porque empacota geometria, materiais e texturas em um único arquivo — ideal para deploy na Vercel sem gestão de paths relativos.

---

## 3. Stack tecnológico (adições à Fase 1)

| Adição | Tecnologia | Justificativa |
|---|---|---|
| Modelagem 3D | Blender 4.x | Padrão da indústria, exportação glTF nativa, gratuito |
| Carregamento de modelos | `useGLTF` (Drei) | Hook otimizado com cache e Suspense |
| Compressão | Draco (via Blender export) | Reduz `.glb` em até 90% |
| Materiais PBR | `MeshStandardMaterial` / `MeshPhysicalMaterial` | Realismo com metálico, rugosidade e oclusão |
| Sombras | `castShadow` / `receiveShadow` + `SoftShadows` (Drei) | Aterrar objetos na cena |
| Pós-processamento | `@react-three/postprocessing` | Bloom nos emissivos, SSAO para profundidade |

---

## 4. Workflow Blender → Three.js (passo a passo)

### 4.1 Configuração do Blender para exportação glTF

1. Usar **unidades métricas** no Blender (`Scene Properties > Units > Metric`, `Unit Scale = 1.0`) — garante que 1 unidade Blender = 1 metro no Three.js.
2. Orientação de eixo: o Blender usa **Y-up** por padrão, mas o exportador glTF converte automaticamente para **Y-up do glTF**. No Three.js (também Y-up), o modelo chegará correto sem rotações adicionais.
3. Aplicar todas as transformações antes de exportar: selecionar o objeto → `Ctrl+A > All Transforms`. Modelos com escala não aplicada têm comportamento imprevisível no Three.js.
4. Exportar via `File > Export > glTF 2.0`:
   - **Format:** glTF Binary (`.glb`)
   - **Include:** Selected Objects, Mesh Data, Materials
   - **Geometry:** aplicar modificadores, Draco Mesh Compression habilitado
   - **Draco:** compression level 6 (equilíbrio qualidade/tamanho)

### 4.2 Carregamento no React Three Fiber

```typescript
// components/scene/obras/ModeloObra.tsx
import { useGLTF } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";

interface Props extends GroupProps {
  caminho: string; // ex: "/models/locomotiva.glb"
}

export function ModeloObra({ caminho, ...props }: Props) {
  const { scene } = useGLTF(caminho);

  // Ativar sombras em todos os meshes do modelo
  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return <primitive object={scene.clone()} {...props} />;
}

// Pré-carregamento (evita flash de loading na cena)
useGLTF.preload("/models/locomotiva.glb");
```

### 4.3 Suspense e loading state

Envolver os modelos em `<Suspense>` para não bloquear a cena durante o carregamento:

```typescript
// app/museu/page.tsx
import { Suspense } from "react";
import { Html, useProgress } from "@react-three/drei";

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="text-white text-lg">
        Carregando acervo... {Math.round(progress)}%
      </div>
    </Html>
  );
}

// Na cena:
<Suspense fallback={<Loader />}>
  <Locomotiva position={[0, 0, 0]} />
  <ObraDiva position={[30, 2, -40]} />
  {/* ... */}
</Suspense>
```

---

## 5. As cinco obras — especificações de modelagem glTF

---

### OBRA 1 — Locomotiva Histórica

**Referência real:** Locomotiva a vapor da antiga Usina Santa Terezinha, exposta na entrada do parque. Marco histórico da era da cana-de-açúcar na Zona da Mata Sul.

#### Guia de modelagem no Blender

**Estrutura de objetos (hierarquia recomendada):**
```
Locomotiva (Empty — objeto pai)
├── Corpo_Principal       # Cilindro horizontal achatado — caldeira
├── Cabine               # Box com janelas (boolean ou inset faces)
├── Chamine              # Cilindro estreito + cone invertido no topo
├── Rodas_Grandes (x2)   # Torus ou cilindro achatado com raios (array modifier)
├── Rodas_Pequenas (x4)  # Idem, escala menor
├── Conector_Rodas       # Barras metálicas conectando rodas (cilindros estreitos)
├── Plataforma_Frontal   # Plano levemente elevado
└── Trilhos (x2)         # Extrusão de perfil em I ao longo de uma curva
```

**Materiais PBR sugeridos:**
| Parte | Base Color | Metallic | Roughness | Notas |
|---|---|---|---|---|
| Corpo/Caldeira | `#2a2a2a` (preto envelhecido) | 0.8 | 0.6 | Normal map de metal amassado |
| Rodas | `#1a1a1a` | 0.9 | 0.4 | Borda levemente reflexiva |
| Cabine | `#3d2b1f` (marrom escuro) | 0.1 | 0.8 | Textura de madeira pintada |
| Chaminé | `#1c1c1c` | 0.7 | 0.5 | Fuligem no topo (vertex paint) |
| Trilhos | `#8b7355` (ferrugem) | 0.6 | 0.8 | Oxidação com roughness map |

**Dicas de modelagem:**
- Subdivisão moderada nas rodas (16–24 lados) — suficiente para parecer redondo sem excesso de polígonos.
- Usar **Array Modifier** para duplicar rodas e trilhos ao longo do eixo X.
- Adicionar **Bevel** nas arestas vivas do corpo para capturar reflexos de luz.
- Detalhes como parafusos podem ser feitos com normal map (de imagem de textura) em vez de geometria, para economizar polígonos.

**Referência visual:** Buscar fotos da locomotiva real na [galeria da Usina de Arte](https://www.usinadearte.org).

**Estimativa de tamanho:** `.glb` com Draco — alvo ≤ 400 KB.

#### Componente React

```typescript
// components/scene/obras/Locomotiva.tsx
import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

export function Locomotiva(props: GroupProps) {
  const { scene } = useGLTF("/models/locomotiva.glb");
  const ref = useRef<THREE.Group>(null);

  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return (
    <group ref={ref} {...props}>
      <primitive object={scene.clone()} />
    </group>
  );
}

useGLTF.preload("/models/locomotiva.glb");
```

---

### OBRA 2 — Diva (Juliana Notari)

**Referência real:** Escultura monumental de 33 metros em poliuretano e fibra de vidro, vermelho-vivo, que se abre como uma fenda vulvar na encosta de uma colina. Uma das obras mais icônicas do acervo, da artista recifense Juliana Notari.

#### Guia de modelagem no Blender

A obra é uma forma orgânica — um rasgo elíptico e profundo em uma superfície inclinada. A abordagem mais fiel é usar **Sculpting** no Blender.

**Processo recomendado:**

1. Criar uma `PlaneGeometry` de alta subdivisão (64×64 ou mais) representando a colina.
2. No modo Sculpt, usar o pincel **Grab** para criar a elevação da colina e o **Draw** para abrir o rasgo central.
3. Modelar as bordas do rasgo com o pincel **Crease** para arestas nítidas.
4. Criar um objeto separado para o interior da fenda (mais profundo, mais escuro).
5. Aplicar **Remesh** (Voxel, 0.05m) para limpar a topologia após sculpting.

**Materiais:**
| Parte | Base Color | Metallic | Roughness | Notas |
|---|---|---|---|---|
| Superfície exterior | `#c0392b` (vermelho-vivo) | 0.0 | 0.3 | Pintura brilhante, normal map de imperfeições sutis |
| Interior da fenda | `#7b241c` (vermelho escuro) | 0.0 | 0.6 | Mais fosco, simula profundidade e sombra |
| Bordas | `#e74c3c` | 0.0 | 0.2 | Levemente mais claro, capta luz |

**Dicas:**
- A colina em si pode permanecer como `Terrain` do Three.js — modelar apenas a escultura que será posicionada sobre ela.
- Usar **Displacement Map** no shader da colina (no Blender ou no Three.js) para criar o volume de terra ao redor da obra.
- A forma não precisa ter 33 metros de escala real — o importante é a proporção visual em relação ao avatar (~1.75m).

**Estimativa de tamanho:** `.glb` com Draco — alvo ≤ 600 KB (topologia orgânica é mais pesada).

#### Componente React

```typescript
// components/scene/obras/ObraDiva.tsx
import { useGLTF } from "@react-three/drei";

export function ObraDiva(props: GroupProps) {
  const { scene } = useGLTF("/models/diva.glb");

  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  // Posicionada sobre a colina — ajustar Y conforme displacement do terrain
  return (
    <group {...props}>
      <primitive object={scene.clone()} />
    </group>
  );
}

useGLTF.preload("/models/diva.glb");
```

---

### OBRA 3 — Paisagem (Regina Silveira)

**Referência real:** Labirinto formado por 59 vidros industriais marcados por tiros de espingarda. A artista paulista Regina Silveira transforma a violência em poética visual, criando um corredor que o visitante percorre entre os painéis de vidro estilhaçados.

#### Guia de modelagem no Blender

A obra é essencialmente **uma estrutura de painéis translúcidos com padrão de fraturas** — ideal para explorar `MeshPhysicalMaterial` com `transmission` no Three.js.

**Estrutura:**
```
Paisagem (Empty)
├── Frame_Estrutural     # Grade metálica que sustenta os vidros
│   ├── Poste_Vertical (x2 por painel)  # Cilindros finos
│   └── Travessa_Horizontal             # Cilindros finos
└── Paineis_Vidro (x59 em duas fileiras paralelas)
    └── Painel_N
        ├── Vidro_Inteiro   # Plano com racha parcial
        └── Fragmentos[]    # Pedaços separados ao redor do tiro
```

**Materiais:**
| Parte | Configuração | Notas |
|---|---|---|
| Vidro intacto | `MeshPhysicalMaterial`, `transmission: 0.9`, `roughness: 0.05`, `ior: 1.5` | Vidro limpo, levemente reflexivo |
| Vidro rachado | Mesmo material + normal map de fraturas | Fraturas simuladas por normal map, não geometria |
| Área do tiro | Fragmentos separados com `roughness` maior e arestas irregulares | Geometria real para o buraco central |
| Frame metálico | `#b0bec5` (aço), `metalness: 0.9`, `roughness: 0.3` | Alumínio levemente oxidado |

**Processo no Blender:**
1. Criar um plano (1m × 2m) representando um painel de vidro.
2. No modo Edit, usar **Knife** para cortar linhas irradiando de um ponto central (simulando o padrão de tiro).
3. Separar os fragmentos ao redor do ponto (`P > Separate`).
4. Usar **Array Modifier** para duplicar os painéis em fileiras.
5. Variar a posição do ponto de tiro em cada painel para diversidade visual.

**Estimativa de tamanho:** `.glb` — alvo ≤ 350 KB (geometria repetida, Draco eficaz).

#### Configuração especial no Three.js

```typescript
// components/scene/obras/ObraPaisagem.tsx
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export function ObraPaisagem(props: GroupProps) {
  const { scene } = useGLTF("/models/paisagem.glb");

  scene.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.isMesh && mesh.name.includes("Vidro")) {
      // MeshPhysicalMaterial para transmissão de luz
      mesh.material = new THREE.MeshPhysicalMaterial({
        transmission: 0.92,
        roughness: 0.04,
        metalness: 0.0,
        ior: 1.5,
        thickness: 0.01,
        color: new THREE.Color("#d6eaf8"),
        side: THREE.DoubleSide,
      });
      mesh.castShadow = false; // vidro não projeta sombra opaca
    }
  });

  return (
    <group {...props}>
      <primitive object={scene.clone()} />
    </group>
  );
}

useGLTF.preload("/models/paisagem.glb");
```

---

### OBRA 4 — Brasil 2017 (Paulo Bruscky)

**Referência real:** Instalação do artista recifense Paulo Bruscky — referência da arte postal e conceitual brasileira. A obra é um comentário político sobre o Brasil de 2017, utilizando a linguagem gráfica dos carimbos, envelopes e textos superpostos que caracterizam a poética do artista.

#### Guia de modelagem no Blender

A obra é essencialmente **instalação têxtil/documental** — envelopes, papéis, carimbos e objetos dispostos em uma estrutura. A abordagem no 3D é criar uma **mesa/mesa de exposição** com objetos distribuídos sobre ela.

**Estrutura:**
```
Brasil2017 (Empty)
├── Mesa_Exposicao       # Superfície horizontal com pés
├── Objetos_Sobre_Mesa
│   ├── Envelope_01..N   # Envelopes abertos/fechados
│   ├── Papel_01..N      # Folhas dobradas/amassadas
│   ├── Carimbo_01..N    # Cilindros com textura de carimbo
│   └── Mapa_Brasil      # Plano com textura de mapa
└── Parede_Fundo         # Plano vertical com colagem de papéis (textura)
```

**Materiais e texturas:**
| Objeto | Abordagem | Notas |
|---|---|---|
| Papéis | `MeshStandardMaterial`, textura de papel amarelado | Roughness alto (~0.9), sem reflexo |
| Envelopes | Idem + textura com timbre postal | Usar UV Unwrap no Blender para alinhar textura |
| Carimbos | Cilindro simples + textura de tinta vermelha | Material bicolor: madeira no cabo, borracha no fundo |
| Mesa | Madeira escura — `roughness: 0.7`, textura de wood grain | |
| Parede-colagem | Plano com textura de foto composta (colagem de jornais/papéis) | Criar a textura como imagem externa no Photoshop/GIMP |

**Processo no Blender:**
1. Modelar os objetos individuais (envelopes: Box + dobras com Loop Cut; papéis amassados: Plane + sculpting suave).
2. Distribuir sobre a mesa usando `Alt+G` para zerar posições relativas.
3. Para a parede de fundo: plano simples com a textura de colagem projetada em UV.
4. **Importante:** agrupar todos os objetos com `Ctrl+J` ou manter como Empty com filhos — depende de performance.

**Estimativa de tamanho:** `.glb` — alvo ≤ 500 KB.

#### Componente React

```typescript
// components/scene/obras/ObraBrasil2017.tsx
import { useGLTF, Text } from "@react-three/drei";

export function ObraBrasil2017(props: GroupProps) {
  const { scene } = useGLTF("/models/brasil2017.glb");

  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return (
    <group {...props}>
      <primitive object={scene.clone()} />
      {/* Texto 3D flutuante como complemento artístico */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.4}
        color="#c0392b"
        font="/fonts/PlayfairDisplay-Bold.woff"
        anchorX="center"
        anchorY="middle"
      >
        BRASIL 2017
      </Text>
    </group>
  );
}

useGLTF.preload("/models/brasil2017.glb");
```

---

### OBRA 5 — Hangar José Rufino

**Referência real:** Instalação do artista paraibano José Rufino dentro do hangar histórico da Usina. Reúne facões usados no corte de cana-de-açúcar, documentos manuscritos e objetos que constroem uma memória da cultura sucroalcooleira de Pernambuco. O hangar em si faz parte da obra — o espaço industrial é parte da narrativa.

#### Guia de modelagem no Blender

Esta é a obra mais complexa por incluir o **espaço arquitetônico** (o hangar) além dos objetos internos. É também a única onde o usuário pode **entrar** no espaço e caminhar entre os objetos — o que exige atenção especial à escala e à navegabilidade.

**Estrutura:**
```
Hangar_JoseRufino (Empty)
├── Estrutura_Hangar
│   ├── Paredes (x2 laterais + fundo)
│   ├── Telhado (arco metálico característico de hangares)
│   ├── Colunas_Metalicas (x6 ao longo das laterais)
│   ├── Janelas_Laterais (planos com vidro em grade)
│   └── Piso_Concreto
└── Instalacao_Interna
    ├── Facao_01..N      # Facões suspensos por fios do teto
    ├── Fio_Suspensao    # Cilindros finos (curves no Blender)
    ├── Mesa_Documentos  # Mesa com papéis manuscritos
    ├── Vitrine_Objetos  # Box de vidro com objetos internos
    └── Iluminacao_Conica (x4)  # Spots de luz cônica no teto
```

**Materiais:**
| Parte | Configuração | Notas |
|---|---|---|
| Paredes | Concreto envelhecido — textura + roughness alto | Usar Substance textures ou procedural no Blender |
| Telhado metálico | Zinco envelhecido — `metalness: 0.7`, `roughness: 0.5` | Normal map de ondulações |
| Facões | Aço inox — `metalness: 1.0`, `roughness: 0.2` | Reflexo nítido, lâmina espelhada |
| Fios de suspensão | `#888888`, thin cylinder, `metalness: 0.8` | Fios que sustentam os facões do teto |
| Piso | Concreto polido — `roughness: 0.4` | Levemente reflexivo |

**Processo:**
1. Modelar o hangar com **Box Modeling** — paredes, arco do teto com Bezier Curve extrudada.
2. Os facões: modelar um único facão (geometria fina, lâmina, cabo), então usar **Array + Curve** para distribuir suspensos.
3. Os fios: criar com **Bezier Curves** e `Convert to Mesh` antes de exportar glTF.
4. **Importante para navegabilidade:** garantir que a abertura do hangar (porta) tem pelo menos 3m × 4m para o avatar entrar.
5. Usar **Double Side** nas paredes internas para que sejam visíveis de dentro.

**Estimativa de tamanho:** `.glb` — alvo ≤ 800 KB (maior modelo do projeto).

#### Componente React com iluminação interna

```typescript
// components/scene/obras/ObraHangar.tsx
import { useGLTF } from "@react-three/drei";
import { SpotLight } from "@react-three/drei";

export function ObraHangar(props: GroupProps) {
  const { scene } = useGLTF("/models/hangar-rufino.glb");

  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return (
    <group {...props}>
      <primitive object={scene.clone()} />
      {/* Iluminação cônica interna — spots no teto */}
      <SpotLight
        position={[0, 6, 0]}
        angle={0.4}
        penumbra={0.5}
        intensity={2}
        color="#fff5e0"
        castShadow
      />
      <SpotLight
        position={[-4, 6, 0]}
        angle={0.4}
        penumbra={0.5}
        intensity={1.5}
        color="#fff5e0"
        castShadow
      />
    </group>
  );
}

useGLTF.preload("/models/hangar-rufino.glb");
```

---

## 6. Organização dos arquivos `.glb` no repositório

```
public/
└── models/
    ├── locomotiva.glb          # ≤ 400 KB
    ├── diva.glb                # ≤ 600 KB
    ├── paisagem.glb            # ≤ 350 KB
    ├── brasil2017.glb          # ≤ 500 KB
    └── hangar-rufino.glb       # ≤ 800 KB
```

**Total estimado de modelos:** ≤ 2.65 MB — viável para carregamento web com o preload do Drei distribuindo ao longo do tempo de navegação.

---

## 7. Atualizações no arquivo `data/obras.ts`

O campo `modeloCaminho` é adicionado à interface `Obra` para ligar os dados ao arquivo `.glb`:

```typescript
export interface Obra {
  id: string;
  titulo: string;
  artista: string;
  descricao: string;
  posicao: [number, number, number];
  cor: string;               // Mantido para fallback se modelo não carregar
  corEmissiva?: string;
  raioProximidade: number;
  modeloCaminho: string;     // NOVO: caminho para o .glb em /public/models/
  escala?: [number, number, number]; // NOVO: ajuste de escala se necessário
}
```

---

## 8. Pós-processamento para realismo adicional

Com os modelos glTF carregados, adicionar pós-processamento com `@react-three/postprocessing`:

```typescript
// components/scene/PostProcessing.tsx
import { EffectComposer, SSAO, Bloom } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

export function PostProcessing() {
  return (
    <EffectComposer>
      {/* Ambient Occlusion para profundidade nas dobras dos modelos */}
      <SSAO
        radius={0.4}
        intensity={30}
        luminanceInfluence={0.1}
        blendFunction={BlendFunction.MULTIPLY}
      />
      {/* Bloom para os materiais emissivos (highlight das obras ao clicar) */}
      <Bloom
        luminanceThreshold={0.4}
        luminanceSmoothing={0.9}
        intensity={0.3}
      />
    </EffectComposer>
  );
}
```

---

## 9. Sombras e iluminação global

Ativar sombras suaves no renderer para integrar os modelos ao terreno:

```typescript
// components/scene/SceneSetup.tsx
import { SoftShadows } from "@react-three/drei";

// Dentro do Canvas:
<Canvas shadows gl={{ antialias: true }}>
  <SoftShadows size={10} samples={16} focus={0.5} />
  <directionalLight
    position={[50, 80, 30]}
    intensity={2.5}
    color="#ffb347"     // Golden Hour — laranja quente
    castShadow
    shadow-mapSize={[2048, 2048]}
    shadow-camera-far={300}
    shadow-camera-left={-100}
    shadow-camera-right={100}
    shadow-camera-top={100}
    shadow-camera-bottom={-100}
  />
  <ambientLight intensity={0.4} color="#ffecd2" />
  {/* Cena e modelos */}
</Canvas>
```

---

## 10. Cronograma sugerido (Fase 2 — 2 semanas)

| Período | Entrega |
|---|---|
| Dias 1–2 | Setup Blender: aprender export glTF + modelar locomotiva (mais simples) |
| Dias 3–4 | Modelar "Diva" (sculpting) + integrar locomotiva no R3F com `useGLTF` |
| Dias 5–6 | Modelar Paisagem (vidros) + configurar `MeshPhysicalMaterial` no Three.js |
| Dias 7–8 | Modelar Brasil 2017 + criar texturas no GIMP/Photoshop |
| Dias 9–10 | Modelar Hangar José Rufino (maior modelo) + SpotLights internas |
| Dias 11–12 | Integrar pós-processamento (SSAO, Bloom) + ajustar sombras |
| Dias 13–14 | Testes de performance (Lighthouse, DevTools), ajustes de Draco, deploy na Vercel |

---

## 11. Checklist de entrega da Fase 2

- [ ] 5 modelos `.glb` na pasta `public/models/` com Draco compression
- [ ] Componentes individuais por obra em `components/scene/obras/`
- [ ] `data/obras.ts` atualizado com campo `modeloCaminho`
- [ ] Sombras ativadas e ajustadas para iluminação Golden Hour
- [ ] Pós-processamento (SSAO + Bloom) integrado
- [ ] Fallback visual se `.glb` não carregar (manter primitivo como backup via `<Suspense>`)
- [ ] README atualizado com screenshots dos modelos e créditos de modelagem
- [ ] Deploy na Vercel funcionando com todos os modelos carregando

---

## 12. Recursos de referência

- [Documentação glTF 2.0 — Khronos Group](https://www.khronos.org/gltf/)
- [Drei — `useGLTF`](https://github.com/pmndrs/drei#usegltf)
- [Blender glTF Export — Manual Oficial](https://docs.blender.org/manual/en/latest/addons/import_export/scene_gltf2.html)
- [Three.js MeshPhysicalMaterial](https://threejs.org/docs/#api/en/materials/MeshPhysicalMaterial)
- [React Three Fiber — Shadows](https://docs.pmnd.rs/react-three-fiber/advanced/scaling-performance#shadows)
- [Galeria oficial — Usina de Arte](https://www.usinadearte.org)

---

*Planejamento elaborado para a Fase 2 do UsinaVR — Hackweb Web3 / RESTIC 29*
