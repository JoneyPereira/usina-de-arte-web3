# Plano de Migração — `usina-de-arte-web3` → Estrutura ExpoVerse Template

**Projeto:** UsinaVR — Museu Digital Imersivo
**Hackathon:** Hackweb Web3 — RESTIC 29 / Desafio ExpoVerse
**Aluno:** Joney Sousa Pereira
**Repositório atual:** https://github.com/JoneyPereira/usina-de-arte-web3
**Template de referência:** https://github.com/JoneyPereira/expoverse-template

---

## 1. Contexto

O repositório atual (`usina-de-arte-web3`) foi construído com a estrutura de um projeto **Next.js completo** (App Router, TypeScript, Tailwind CSS), gerado a partir do `expoverse-template`. O template oficial do hackathon, por sua vez, adota uma organização de pastas mais simples e plana — sem framework específico — com diretórios como `src/`, `models/`, `textures/`, `assets/`, `scenes/` e `docs/` dispostos diretamente na raiz do repositório.

O objetivo deste plano é reorganizar as pastas e arquivos do projeto para espelhar o padrão esperado pelo avaliador, **sem abandonar a stack atual** (Next.js + TypeScript + React Three Fiber), pois o avaliador provavelmente verifica a organização de pastas, não a stack em si.

> **Nota importante:** Caso a avaliação exija paridade total de stack com o template (JavaScript puro, sem Next.js), seria necessária uma migração de Next.js para Vite + React. Isso representa um escopo significativamente maior e deve ser confirmado antes de ser executado.

---

## 2. Comparativo de estruturas

### 2.1 Estrutura atual (`usina-de-arte-web3`)

```
usina-de-arte-web3/
├── .github/workflows/
├── app/
│   ├── page.tsx               # Landing page (/)
│   ├── museu/page.tsx         # Cena 3D principal (/museu)
│   └── sobre/page.tsx         # Sobre o projeto (/sobre)
├── components/
│   ├── scene/                 # Componentes da cena 3D (R3F)
│   └── ui/                    # Overlays HTML / interface 2D
├── data/
│   └── obras.ts               # Dados tipados das obras
├── docs/
├── hooks/
│   └── useProximidade.ts
├── public/
│   ├── models/                # Assets .glb
│   └── textures/              # Mapas de textura
├── types/
├── .eslintrc.json
├── .gitignore
├── LICENSE
├── README.md
├── next.config.mjs
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

### 2.2 Estrutura alvo (`expoverse-template`)

```
expoverse-template/
├── assets/
├── docs/
├── models/
├── public/
├── scenes/
├── src/
├── textures/
├── .gitignore
├── LICENSE
└── README.md
```

---

## 3. Mapeamento de pastas: antes → depois

| Pasta/Arquivo atual | Pasta/Arquivo alvo | Ação |
|---|---|---|
| `app/` | `src/pages/` | Mover e renomear |
| `components/` | `src/components/` | Mover para dentro de `src/` |
| `data/` | `src/data/` | Mover para dentro de `src/` |
| `hooks/` | `src/hooks/` | Mover para dentro de `src/` |
| `types/` | `src/types/` | Mover para dentro de `src/` |
| `public/models/` | `models/` | Mover para a raiz |
| `public/textures/` | `textures/` | Mover para a raiz |
| `public/` (demais) | `public/` | Manter sem alteração |
| `docs/` | `docs/` | Manter sem alteração |
| — | `assets/` | Criar (logo, imagens das obras, screenshots) |
| — | `scenes/` | Criar (configurações de cena em JSON/JS) |

---

## 4. Passo a passo da migração

### Passo 1 — Criar branch de trabalho

Nunca realizar a migração diretamente na branch `main`. Criar uma branch dedicada:

```bash
git checkout -b refactor/expoverse-structure
```

---

### Passo 2 — Criar as novas pastas da raiz

```bash
mkdir -p assets scenes models textures
mkdir -p src/pages src/components src/data src/hooks src/types
```

---

### Passo 3 — Mover modelos e texturas para a raiz

Os modelos `.glb` e as texturas saem de dentro de `public/` e passam a viver em pastas próprias na raiz, como o template define:

```bash
# Mover modelos .glb
mv public/models/* models/
rmdir public/models

# Mover texturas
mv public/textures/* textures/
rmdir public/textures
```

> **Atenção:** Após mover os arquivos, todos os caminhos de referência no código precisam ser atualizados. Ver Passo 7.

---

### Passo 4 — Consolidar código-fonte em `src/`

Mover o código TypeScript/React para dentro de `src/`, seguindo a convenção do template:

```bash
# Páginas (era app/ do Next.js App Router)
mv app/* src/pages/
rmdir app

# Componentes
mv components/* src/components/
rmdir components

# Dados das obras
mv data/* src/data/
rmdir data

# Hooks customizados
mv hooks/* src/hooks/
rmdir hooks

# Tipos TypeScript
mv types/* src/types/
rmdir types
```

---

### Passo 5 — Popular `assets/`

Mover para `assets/` qualquer recurso estático que seja parte da identidade do projeto (não servido diretamente pelo Next.js):

```bash
# Exemplos: logo do projeto, imagens de obras para o README, screenshots
mv public/images/* assets/    # se a pasta existir
```

Conteúdo sugerido para `assets/`:
- Logo do UsinaVR (SVG ou PNG)
- Screenshots da experiência para o README
- Imagens de referência das obras reais (Diva, Paisagem, etc.)
- Eventuais ícones e fontes customizadas

---

### Passo 6 — Popular `scenes/`

Criar em `scenes/` um arquivo de configuração da cena principal. Este arquivo representa o "roteiro" do ambiente — quais obras existem, suas posições, propriedades visuais. É essencialmente o conteúdo do `data/obras.ts` exportado como JSON independente de framework:

```bash
touch scenes/museu-principal.json
```

Estrutura sugerida para `scenes/museu-principal.json`:

```json
{
  "nome": "Percurso Principal — Usina de Arte",
  "comprimento_metros": 200,
  "iluminacao": "golden_hour",
  "obras": [
    {
      "id": "locomotiva",
      "titulo": "Locomotiva Histórica",
      "artista": "Acervo Usina Santa Terezinha",
      "posicao": [0, 0, 0],
      "modeloCaminho": "../models/locomotiva.glb"
    },
    {
      "id": "diva",
      "titulo": "Diva",
      "artista": "Juliana Notari",
      "posicao": [30, 2, -40],
      "modeloCaminho": "../models/diva.glb"
    }
  ]
}
```

Manter o `src/data/obras.ts` tipado para uso interno do Next.js, e o `scenes/museu-principal.json` como documentação/configuração legível pelo avaliador.

---

### Passo 7 — Atualizar imports e caminhos no código

Esta é a etapa mais trabalhosa. Com as pastas reorganizadas, os imports precisam ser ajustados em dois níveis:

#### 7.1 Aliases de path no `tsconfig.json`

Atualizar o `tsconfig.json` para refletir a nova estrutura:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/components/*": ["src/components/*"],
      "@/data/*":       ["src/data/*"],
      "@/hooks/*":      ["src/hooks/*"],
      "@/types/*":      ["src/types/*"],
      "@/scenes/*":     ["scenes/*"]
    }
  }
}
```

#### 7.2 Caminhos dos modelos `.glb`

Com os modelos saindo de `public/models/` para `models/` (na raiz), os caminhos precisam ser atualizados em todos os componentes que usam `useGLTF`:

```typescript
// ANTES
useGLTF("/models/locomotiva.glb")

// DEPOIS — se servido via Next.js public/, ajustar next.config.mjs
// OU manter em public/ e criar symlink/cópia em models/ para o template
useGLTF("/models/locomotiva.glb")  // continua funcionando se reconfigurado
```

> **Dica:** A forma mais segura é manter os `.glb` em `public/models/` para o Next.js funcionar corretamente, e criar **cópias ou symlinks** em `models/` apenas para satisfazer a estrutura visual do repositório no GitHub. Alternativamente, configurar o `next.config.mjs` para servir a pasta `models/` da raiz.

#### 7.3 Imports entre módulos

Busca global para atualizar referências:

```bash
# Exemplos de substituições necessárias
# @/components/ → sem mudança (alias atualizado no tsconfig)
# ../data/obras → ../src/data/obras (se import relativo)
```

---

### Passo 8 — Atualizar `next.config.mjs` (opcional)

Para servir os modelos `.glb` a partir da pasta `models/` na raiz (fora de `public/`), adicionar configuração de rewrite ou webpack:

```javascript
// next.config.mjs
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      type: 'asset/resource',
    });
    return config;
  },
};

export default nextConfig;
```

---

### Passo 9 — Atualizar o `README.md`

O README é um dos requisitos mínimos avaliados no hackathon. Após a migração, atualizar obrigatoriamente:

- A seção **"Estrutura do projeto"** com a nova organização de pastas
- O campo **"Equipe"** (atualmente vazio no template)
- O link de **deploy na Vercel** (substituir `[link-vercel-aqui]`)
- Adicionar **screenshots** atualizados da experiência em `assets/`

---

### Passo 10 — Verificar `.gitignore`

Garantir que as novas pastas não são acidentalmente ignoradas:

```gitignore
# Verificar que estas pastas NÃO estão no .gitignore
# models/
# textures/
# assets/
# scenes/

# Pastas que DEVEM continuar ignoradas
/node_modules
/.next
/out
/.vercel
```

---

### Passo 11 — Commit, push e merge

```bash
# Adicionar todas as mudanças
git add .

# Commit descritivo
git commit -m "refactor: migra estrutura de pastas para padrão expoverse-template

- Move app/ → src/pages/
- Move components/, data/, hooks/, types/ → src/
- Move public/models/ → models/ (raiz)
- Move public/textures/ → textures/ (raiz)
- Cria assets/ e scenes/ na raiz
- Atualiza aliases no tsconfig.json
- Atualiza README com nova estrutura"

# Push da branch
git push origin refactor/expoverse-structure

# Abrir Pull Request no GitHub e fazer merge para main após revisão
```

---

## 5. Estrutura final esperada

```
usina-de-arte-web3/
├── .github/workflows/
│
├── assets/                    # ← NOVO: logo, screenshots, imagens de referência
│   ├── logo-usinavr.svg
│   ├── screenshot-cena.png
│   └── obras/                 # imagens das obras reais
│
├── docs/                      # documentação técnica (já existia)
│
├── models/                    # ← MOVIDO de public/models/
│   ├── locomotiva.glb
│   ├── diva.glb
│   ├── paisagem.glb
│   ├── brasil2017.glb
│   └── hangar-rufino.glb
│
├── public/                    # arquivos servidos diretamente pelo Next.js
│   └── fonts/
│
├── scenes/                    # ← NOVO: configurações de cena em JSON
│   └── museu-principal.json
│
├── src/                       # ← NOVO: todo o código-fonte consolidado
│   ├── pages/                 # (era app/ do Next.js)
│   │   ├── page.tsx
│   │   ├── museu/page.tsx
│   │   └── sobre/page.tsx
│   ├── components/
│   │   ├── scene/
│   │   └── ui/
│   ├── data/
│   │   └── obras.ts
│   ├── hooks/
│   │   └── useProximidade.ts
│   └── types/
│
├── textures/                  # ← MOVIDO de public/textures/
│
├── .eslintrc.json
├── .gitignore
├── LICENSE
├── README.md                  # atualizar com nova estrutura e link Vercel
├── next.config.mjs
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## 6. Riscos e mitigações

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Quebra de imports após mover pastas | Alta | Usar busca global (Ctrl+Shift+F) no VS Code antes de commitar; rodar `npm run build` para checar erros |
| Next.js não encontrar modelos `.glb` fora de `public/` | Média | Manter cópia em `public/models/` e usar `models/` na raiz só para estrutura do repositório |
| Branch de refactor ficar desatualizada com main | Baixa | Fazer a migração de uma vez, sem commits intermediários não relacionados na mesma branch |
| Aliases do `tsconfig.json` não serem reconhecidos | Baixa | Reiniciar o servidor de desenvolvimento após atualizar o `tsconfig.json` |

---

## 7. Checklist de entrega

- [ ] Branch `refactor/expoverse-structure` criada
- [ ] Pastas `assets/`, `scenes/`, `models/`, `textures/` criadas na raiz
- [ ] Todo o código-fonte movido para `src/`
- [ ] `tsconfig.json` atualizado com novos aliases de path
- [ ] Caminhos de modelos `.glb` verificados e funcionando
- [ ] `npm run dev` rodando sem erros após migração
- [ ] `npm run build` concluindo sem erros
- [ ] `README.md` atualizado (estrutura, link Vercel, equipe)
- [ ] `.gitignore` verificado (novas pastas não ignoradas)
- [ ] Pull Request aberto e merge feito para `main`
- [ ] Deploy na Vercel verificado após merge

---

*Plano elaborado para o Hackweb Web3 — RESTIC 29 / Desafio ExpoVerse*
