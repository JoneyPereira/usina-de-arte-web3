# Planejamento do MVP — UsinaVR: Museu Digital Imersivo

**Projeto:** UsinaVR  
**Hackathon:** Hackweb Web3 — RESTIC 29 / Desafio ExpoVerse  
**Aluno:** Joney Sousa Pereira  
**Data:** Maio 2025

---

## 1. Visão geral

O UsinaVR é uma experiência em Realidade Virtual acessível pelo navegador que recria um percurso imersivo pela [Usina de Arte](https://www.usinadearte.org/) — parque artístico-botânico localizado em Água Preta, Zona da Mata Sul de Pernambuco. O problema central que o projeto resolve é a barreira geográfica de acesso ao museu: situado a cerca de 150 km de Recife, sem transporte público direto, o acervo de mais de 40 obras de artistas nacionais e internacionais permanece inacessível para a maior parte da população. O MVP cria um ambiente virtual navegável, funcional e interativo que democratiza esse acesso diretamente pelo navegador, sem necessidade de instalação.

---

## 2. Stack tecnológico

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Framework | Next.js 14 (App Router) | Roteamento, SSR e deploy simplificado na Vercel |
| Cena 3D | React Three Fiber + Drei | Three.js com API React — cada obra vira um componente reutilizável |
| XR / imersão | @react-three/xr | Suporte a WebXR para headsets (diferencial) |
| Estilo | Tailwind CSS | Utility-first, rápido para MVP |
| Animações | Framer Motion | Transições suaves nos overlays 2D |
| Deploy | Vercel | Link público gerado automaticamente — exigência do ExpoVerse |

**Por que Next.js + React Three Fiber e não Unity WebGL?**  
O formato de entrega exige um link público acessível via navegador. Next.js + R3F atende esse requisito com deploy zero-esforço na Vercel, enquanto Unity WebGL exige build customizado e hospedagem separada. Além disso, a arquitetura baseada em componentes React facilita a organização do código para revisão da banca e mantém o projeto escalável.

---

## 3. Ambiente virtual (cena 3D)

O ambiente recria um percurso linear de aproximadamente 200 m partindo da entrada do parque (com a locomotiva histórica) em direção ao núcleo do acervo.

### 3.1 Composição da cena

- **Terreno:** `PlaneGeometry` com displacement map para colinas suaves; textura de grama estilizada (Low Poly)
- **Skybox:** Skybox procedural com tons laranja/dourado simulando o entardecer pernambucano (Golden Hour)
- **Vegetação:** Árvores e arbustos Low Poly com GPU Instancing via R3F (`<Instances>`) para manter performance
- **Estrutura industrial:** Fachada da usina e chaminés ao fundo compostas por `BoxGeometry` e `CylinderGeometry`
- **Iluminação:** `DirectionalLight` com cor quente (RGB ~255, 180, 80) + `AmbientLight` suave + `fog` leve para profundidade de cena

### 3.2 Cinco pontos de interesse (obras)

| # | Obra | Artista | Representação 3D |
|---|---|---|---|
| 1 | Locomotiva histórica | — | Primitivos (cilindros + cubos) — marco de chegada |
| 2 | Diva | Juliana Notari | Forma alongada vermelha-terracota em colina com DisplacementMap |
| 3 | Paisagem | Regina Silveira | Painel de vidros com material semi-transparente (`MeshPhysicalMaterial`) |
| 4 | Brasil 2017 | Paulo Bruscky | Instalação textual em painel 3D (`TextGeometry` / Drei `<Text>`) |
| 5 | Hangar José Rufino | José Rufino | Estrutura industrial com objetos internos visitáveis |

Todos os dados das obras ficam centralizados em `data/obras.ts` — um array tipado com título, artista, descrição, posição XYZ e cor — que alimenta tanto a cena 3D quanto os painéis de texto.

---

## 4. Interações obrigatórias

### 4.1 Painel informativo por proximidade (interação principal)

Ao se aproximar de qualquer uma das 5 obras, um painel flutuante em overlay HTML é exibido com título, nome do artista e breve descrição. Ao se afastar, o painel desaparece. A lógica de detecção é encapsulada no hook `useProximidade.ts`, que calcula a distância entre a posição do jogador e cada obra a cada frame via `useFrame()` do R3F.

```
Entrada na zona (< 5 unidades) → painel aparece com animação Framer Motion
Saída da zona (> 5 unidades) → painel desaparece com fade-out
```

### 4.2 Highlight por clique / raycast (interação secundária)

Ao clicar em uma obra, ela emite cor emissiva (`emissiveIntensity` aumentado via `onClick` do R3F) e um painel lateral com foto e texto expandido é aberto na interface 2D. Um segundo clique retorna ao estado normal.

### 4.3 Navegação

- **Teclado + mouse:** WASD / setas para mover + arrastar para olhar (`PointerLockControls` do Drei)
- **Mobile:** toque na tela para orientação + botões de direção opcionais
- **Modo VR:** botão "Entrar em VR" usa `@react-three/xr` para ativar WebXR quando headset disponível (diferencial)

---

## 5. Estrutura de rotas (Next.js)

```
/           → Landing page: apresentação do projeto + botão "Entrar no museu"
/museu      → Cena 3D principal (componente Canvas do R3F)
/sobre      → Contexto histórico da Usina de Arte + créditos
```

---

## 6. Estrutura de pastas do repositório

```
UsinaVR/
├── app/
│   ├── page.tsx               # Landing page (/)
│   ├── museu/
│   │   └── page.tsx           # Cena 3D (/museu)
│   └── sobre/
│       └── page.tsx           # Sobre o projeto (/sobre)
│
├── components/
│   ├── scene/
│   │   ├── Terrain.tsx        # Terreno com displacement map
│   │   ├── Sky.tsx            # Skybox procedural (entardecer)
│   │   ├── Vegetacao.tsx      # Árvores e arbustos instanciados
│   │   ├── Locomotiva.tsx     # Ponto de interesse 1
│   │   ├── Obra.tsx           # Componente genérico de obra (recebe dados de obras.ts)
│   │   ├── FachadaUsina.tsx   # Estrutura industrial ao fundo
│   │   └── PlayerController.tsx # PointerLockControls + movimento WASD
│   │
│   └── ui/
│       ├── PainelFlutuante.tsx  # Overlay de proximidade (Framer Motion)
│       ├── SidePanel.tsx        # Painel lateral de detalhes ao clicar
│       ├── HUD.tsx              # Instruções de controle (fade-out automático)
│       └── BotaoVR.tsx          # Entrada em modo WebXR
│
├── data/
│   └── obras.ts               # Array tipado com todas as obras
│
├── hooks/
│   └── useProximidade.ts      # Hook: retorna qual obra está próxima do jogador
│
├── public/
│   ├── models/                # Arquivos .glb (assets 3D externos, se houver)
│   └── textures/              # Mapas de grama, bark, displacement
│
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 7. Arquivo central de dados — `data/obras.ts`

```typescript
export interface Obra {
  id: string;
  titulo: string;
  artista: string;
  descricao: string;
  posicao: [number, number, number]; // XYZ na cena
  cor: string;                        // Cor principal da representação 3D
  corEmissiva?: string;               // Cor de destaque ao clicar
  raioProximidade: number;            // Distância para ativar o painel
}

export const obras: Obra[] = [
  {
    id: "locomotiva",
    titulo: "Locomotiva Histórica",
    artista: "Acervo da Usina Santa Terezinha",
    descricao: "Locomotiva original da antiga usina de cana-de-açúcar, símbolo da era industrial da Zona da Mata Sul de Pernambuco. Marco visual de chegada ao parque.",
    posicao: [0, 0, 0],
    cor: "#5a3e2b",
    corEmissiva: "#a0622a",
    raioProximidade: 5,
  },
  {
    id: "diva",
    titulo: "Diva",
    artista: "Juliana Notari",
    descricao: "Escultura monumental de 33 metros que se abre em uma colina como uma fenda vermelha na terra. Obra da artista recifense que dialoga com corpo, gênero e natureza.",
    posicao: [30, 2, -40],
    cor: "#c0392b",
    corEmissiva: "#e74c3c",
    raioProximidade: 8,
  },
  {
    id: "paisagem",
    titulo: "Paisagem",
    artista: "Regina Silveira",
    descricao: "Labirinto formado por 59 vidros marcados por tiros. A obra da artista paulista transforma a violência em experiência estética e reflexão sobre a paisagem brasileira.",
    posicao: [60, 0, -20],
    cor: "#85c1e9",
    corEmissiva: "#aed6f1",
    raioProximidade: 6,
  },
  {
    id: "brasil2017",
    titulo: "Brasil 2017",
    artista: "Paulo Bruscky",
    descricao: "Instalação do artista recifense Paulo Bruscky que usa a linguagem da arte postal e conceitual para comentar o momento político e social do Brasil.",
    posicao: [90, 0, -60],
    cor: "#27ae60",
    corEmissiva: "#2ecc71",
    raioProximidade: 5,
  },
  {
    id: "hangar-rufino",
    titulo: "Hangar José Rufino",
    artista: "José Rufino",
    descricao: "Instalação do artista paraibano dentro do hangar histórico da usina. Reúne facões de corte de cana, documentos e memórias da cultura sucroalcooleira de Pernambuco.",
    posicao: [120, 0, -10],
    cor: "#7f8c8d",
    corEmissiva: "#bdc3c7",
    raioProximidade: 10,
  },
];
```

---

## 8. Hook central — `useProximidade.ts`

```typescript
import { useFrame, useThree } from "@react-three/fiber";
import { useState } from "react";
import { obras, type Obra } from "@/data/obras";
import * as THREE from "three";

export function useProximidade(): Obra | null {
  const { camera } = useThree();
  const [obraProxima, setObraProxima] = useState<Obra | null>(null);

  useFrame(() => {
    const posJogador = camera.position;
    let encontrada: Obra | null = null;

    for (const obra of obras) {
      const posObra = new THREE.Vector3(...obra.posicao);
      const distancia = posJogador.distanceTo(posObra);

      if (distancia < obra.raioProximidade) {
        encontrada = obra;
        break;
      }
    }

    setObraProxima((prev) =>
      prev?.id !== encontrada?.id ? encontrada : prev
    );
  });

  return obraProxima;
}
```

---

## 9. Entregáveis do ExpoVerse

| # | Entregável | Status |
|---|---|---|
| 1 | Repositório GitHub público com código comentado | A fazer |
| 2 | README explicando proposta, tecnologias e execução | A fazer |
| 3 | Link funcional na Vercel (demonstração navegável) | A fazer |
| 4 | Evidências de funcionamento (prints / vídeo demo) | A fazer |
| 5 | Vídeo-pitch de até 5 minutos | A fazer |
| 6 | Slides de apresentação | A fazer |

---

## 10. Cronograma sugerido (2 semanas)

| Período | Foco |
|---|---|
| Dias 1–2 | Setup Next.js + R3F + cena base vazia rodando localmente |
| Dias 3–4 | Terreno, skybox, vegetação com instancing, iluminação Golden Hour |
| Dias 5–6 | 5 obras posicionadas + dados em `obras.ts` |
| Dias 7–8 | Interações: hook `useProximidade`, painel flutuante, highlight por clique |
| Dias 9–10 | UI overlays (HUD, SidePanel), página `/sobre`, ajustes visuais |
| Dias 11–14 | Deploy Vercel, README, slides, gravação do vídeo-pitch, entrega final |

---

## 11. Diferenciais para a avaliação

- **Dado centralizado em `obras.ts`:** arquitetura limpa, fácil de demonstrar e escalar para as 40+ obras reais do acervo
- **Hook `useProximidade` reutilizável:** lógica encapsulada, demonstra boas práticas de desenvolvimento React
- **WebXR opcional:** botão de entrada em modo VR para headsets compatíveis, sem quebrar a experiência desktop
- **Narrativa clara de inclusão:** o problema (barreira geográfica) e a solução (acesso digital) são comunicados desde a landing page
- **Deploy automático na Vercel:** link público disponível desde o início do desenvolvimento, facilitando testes e avaliação

---

*Planejamento elaborado para o Hackweb Web3 — RESTIC 29 / Desafio ExpoVerse*
