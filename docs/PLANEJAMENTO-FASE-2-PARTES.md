# Planejamento Fase 2 — Divisão em Pequenas Partes

Este arquivo é um **índice de execução** que fatia o planejamento detalhado
[`PLANEJAMENTO-MVP-UsinaVR-Fase-2_gltf.md`](./PLANEJAMENTO-MVP-UsinaVR-Fase-2_gltf.md)
em 10 entregas pequenas e independentes — cada uma do tamanho de um commit ou PR.

A ordem sugerida é a numerada abaixo. As Partes 3–7 (obras) são paralelizáveis
após a Parte 1 estar pronta.

---

## Fluxo geral

```
[1] Infraestrutura  ──►  [2] Contrato de dados
                                  │
        ┌─────────────────────────┴─────────────────────────┐
        ▼                                                   ▼
   [3] Locomotiva    [4] Diva    [5] Paisagem    [6] Brasil 2017    [7] Hangar
        │                                                   │
        └──────────────────────────┬────────────────────────┘
                                   ▼
                [8] Sombras + Golden Hour  ──►  [9] Pós-processamento
                                   │
                                   ▼
                       [10] Performance + Deploy
```

---

## Infraestrutura (bloqueia tudo)

### Parte 1 — Setup de infraestrutura glTF
**Escopo:** instalar `@react-three/postprocessing`; criar componente genérico
`ModeloObra.tsx` (carregamento via `useGLTF`, ativação de sombras, `scene.clone()`);
criar `Loader.tsx` com `useProgress` para feedback de carregamento; envolver a
cena em `<Suspense fallback={<Loader />}>`.
**Seções do plano:** [3 — Stack](./PLANEJAMENTO-MVP-UsinaVR-Fase-2_gltf.md#3-stack-tecnológico-adições-à-fase-1),
[4.2 — Carregamento R3F](./PLANEJAMENTO-MVP-UsinaVR-Fase-2_gltf.md#42-carregamento-no-react-three-fiber),
[4.3 — Suspense e loading](./PLANEJAMENTO-MVP-UsinaVR-Fase-2_gltf.md#43-suspense-e-loading-state).
**Critério de aceite:** `npm run dev` roda sem erros; cena permanece funcional;
fallback de loader aparece se forçarmos um delay no preload.

### Parte 2 — Atualização do contrato de dados
**Escopo:** estender a interface `Obra` em `data/obras.ts` com `modeloCaminho: string`
e `escala?: [number, number, number]`. Preencher `modeloCaminho` (apontando para
arquivos ainda inexistentes em `public/models/`) e ajustar tipos onde houver
erro de TS.
**Seções do plano:** [7 — Atualizações em `data/obras.ts`](./PLANEJAMENTO-MVP-UsinaVR-Fase-2_gltf.md#7-atualizações-no-arquivo-dataobrasts).
**Critério de aceite:** `npm run build` passa; campos opcionais permitem
deploy mesmo antes dos `.glb` existirem (fallback no primitivo via `<Suspense>`).

---

## Obras (paralelizáveis após Parte 1)

> Cada obra é um ciclo: **modelar no Blender → exportar `.glb` com Draco →
> substituir componente primitivo pelo equivalente com `useGLTF`.**
> Os componentes vivem em `components/scene/obras/`.

### Parte 3 — Obra 1: Locomotiva
**Por que primeiro:** geometria mais simples (cilindros + caixas) — ideal
para validar o pipeline Blender → Three.js de ponta a ponta.
**Saídas:** `public/models/locomotiva.glb` (≤ 400 KB), `components/scene/obras/Locomotiva.tsx`.
**Seções do plano:** [5 — OBRA 1: Locomotiva Histórica](./PLANEJAMENTO-MVP-UsinaVR-Fase-2_gltf.md#obra-1--locomotiva-histórica).

### Parte 4 — Obra 2: Diva
**Foco técnico:** sculpting orgânico no Blender (pincéis Grab/Draw/Crease),
remesh Voxel, materiais PBR avermelhados.
**Saídas:** `public/models/diva.glb` (≤ 600 KB), `components/scene/obras/ObraDiva.tsx`.
**Seções do plano:** [5 — OBRA 2: Diva (Juliana Notari)](./PLANEJAMENTO-MVP-UsinaVR-Fase-2_gltf.md#obra-2--diva-juliana-notari).

### Parte 5 — Obra 3: Paisagem
**Foco técnico:** `MeshPhysicalMaterial` com `transmission`, normal map de
fraturas de vidro, override do material no `traverse` do `useGLTF`.
**Saídas:** `public/models/paisagem.glb` (≤ 350 KB), `components/scene/obras/ObraPaisagem.tsx`.
**Seções do plano:** [5 — OBRA 3: Paisagem (Regina Silveira)](./PLANEJAMENTO-MVP-UsinaVR-Fase-2_gltf.md#obra-3--paisagem-regina-silveira).

### Parte 6 — Obra 4: Brasil 2017
**Foco técnico:** modelagem de instalação documental + texturas externas
(papel, carimbos, mapa, colagem de parede) preparadas no GIMP/Photoshop e
empacotadas no `.glb`.
**Saídas:** `public/models/brasil2017.glb` (≤ 500 KB), `components/scene/obras/ObraBrasil2017.tsx`.
**Seções do plano:** [5 — OBRA 4: Brasil 2017 (Paulo Bruscky)](./PLANEJAMENTO-MVP-UsinaVR-Fase-2_gltf.md#obra-4--brasil-2017-paulo-bruscky).

### Parte 7 — Obra 5: Hangar José Rufino
**Foco técnico:** maior modelo do projeto (≤ 800 KB) — espaço arquitetônico
navegável, abertura mínima 3 m × 4 m, SpotLights internas via Drei,
double-side nas paredes internas.
**Saídas:** `public/models/hangar-rufino.glb` (≤ 800 KB), `components/scene/obras/ObraHangar.tsx`.
**Seções do plano:** [5 — OBRA 5: Hangar José Rufino](./PLANEJAMENTO-MVP-UsinaVR-Fase-2_gltf.md#obra-5--hangar-josé-rufino).

---

## Polimento visual

### Parte 8 — Sombras e iluminação Golden Hour
**Escopo:** ativar `shadows` no `<Canvas>`, `SoftShadows` (Drei),
`directionalLight` com cor `#ffb347`, ajustar `shadow-mapSize` e os planos
da câmera de sombra para cobrir o cenário todo.
**Seções do plano:** [9 — Sombras e iluminação global](./PLANEJAMENTO-MVP-UsinaVR-Fase-2_gltf.md#9-sombras-e-iluminação-global).
**Critério de aceite:** modelos projetam sombra coerente no terreno; sem
artefatos de sombra (acne, peter-panning).

### Parte 9 — Pós-processamento
**Escopo:** criar `components/scene/PostProcessing.tsx` com `EffectComposer`,
SSAO (profundidade nas dobras) e Bloom (highlight emissivo nas obras próximas).
**Seções do plano:** [8 — Pós-processamento para realismo adicional](./PLANEJAMENTO-MVP-UsinaVR-Fase-2_gltf.md#8-pós-processamento-para-realismo-adicional).
**Critério de aceite:** FPS permanece > 45 em hardware médio; obra próxima
recebe Bloom visível ao se aproximar.

---

## Entrega

### Parte 10 — Performance, deploy e documentação
**Escopo:** auditoria Lighthouse, ajuste de Draco se algum `.glb`
ultrapassar o alvo, screenshots dos modelos no README, créditos de
modelagem, deploy na Vercel, checklist final.
**Seções do plano:** [6 — Organização dos arquivos `.glb`](./PLANEJAMENTO-MVP-UsinaVR-Fase-2_gltf.md#6-organização-dos-arquivos-glb-no-repositório),
[11 — Checklist de entrega](./PLANEJAMENTO-MVP-UsinaVR-Fase-2_gltf.md#11-checklist-de-entrega-da-fase-2).
**Critério de aceite:** todos os 5 modelos carregam em produção; total
de assets ≤ ~2,65 MB; README com screenshots.

---

## Convenções para todas as partes

- **Branch:** continuar em `feature/segunda-fase`; um commit por parte.
- **Mensagens de commit:** prefixo `parte-N:` (ex: `parte-3: locomotiva via gltf`).
- **Fallback:** enquanto um `.glb` não existir, manter o primitivo da Fase 1
  como fallback dentro do `<Suspense>` para a cena continuar utilizável.
- **Componentes:** novos componentes de obra em `components/scene/obras/`
  (criar essa pasta na Parte 1).
