# UsinaVR — Museu Digital Imersivo

> Experiência em Realidade Virtual que democratiza o acesso ao acervo da [Usina de Arte](https://www.usinadearte.org/) — parque artístico-botânico de Água Preta, Pernambuco.

**Hackweb Web3 · RESTIC 29 · Desafio ExpoVerse**  
**Aluno:** Joney Sousa Pereira  
**Deploy:** [link-vercel-aqui]  

---

## Sobre o projeto

A Usina de Arte é um museu a céu aberto instalado nas dependências da antiga Usina Santa Terezinha (fundada em 1929), em Água Preta — Zona da Mata Sul de Pernambuco, a cerca de 150 km de Recife. Com mais de 45 obras de artistas nacionais e internacionais espalhadas por mais de 30 hectares, o espaço é uma das iniciativas culturais mais importantes do Nordeste brasileiro. O acesso é gratuito, mas geograficamente restrito: não há transporte público direto, o que exclui estudantes de escolas públicas, pessoas com mobilidade reduzida e visitantes de fora do estado.

**O UsinaVR resolve esse problema** criando uma experiência imersiva e navegável pelo navegador, sem instalação, que permite que qualquer pessoa visite e interaja com as obras do museu independentemente de onde esteja.

---

## Contexto e objetivos no Metaverso

O ambiente representa um espaço de entretenimento cultural e educação no Metaverso. Os objetivos principais são:

- **Democratizar o acesso** ao patrimônio artístico-cultural do Nordeste, com foco especial em estudantes de escolas públicas e pessoas com mobilidade reduzida
- **Preservar digitalmente** obras de grande porte instaladas ao ar livre, vulneráveis às condições climáticas
- **Ampliar o alcance educacional** da Usina de Arte para visitantes nacionais e internacionais que não podem se deslocar fisicamente
- **Demonstrar** como tecnologias imersivas podem transformar a comunicação cultural de museus e espaços públicos

---

## A experiência

O ambiente virtual recria um percurso linear de aproximadamente 200 m partindo da entrada principal do parque (com a locomotiva histórica) em direção ao núcleo do acervo. O usuário navega em primeira pessoa por um cenário com vegetação tropical estilizada, iluminação de fim de tarde (Golden Hour pernambucano) e a fachada da usina ao fundo.

**Ao longo do percurso, cinco obras emblemáticas podem ser visitadas:**

| Obra | Artista |
|---|---|
| Locomotiva Histórica | Acervo da Usina Santa Terezinha |
| Diva | Juliana Notari |
| Paisagem | Regina Silveira |
| Brasil 2017 | Paulo Bruscky |
| Hangar José Rufino | José Rufino |

**Interações disponíveis:**

- Aproximar-se de uma obra exibe um painel informativo flutuante com título, artista e descrição
- Clicar em uma obra a destaca com cor emissiva e abre um painel lateral com informações expandidas
- Navegar pelo percurso com teclado + mouse (WASD + arrastar) ou dispositivo móvel
- Entrar em modo VR via botão dedicado (requer headset WebXR compatível)

---

## Tecnologias utilizadas

| Tecnologia | Uso |
|---|---|
| [Next.js 14](https://nextjs.org/) | Framework React com App Router e roteamento de páginas |
| [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) | Renderização 3D declarativa com Three.js |
| [Drei](https://github.com/pmndrs/drei) | Helpers R3F: `PointerLockControls`, `Text`, `Instances`, `Sky` |
| [@react-three/xr](https://github.com/pmndrs/xr) | Suporte a WebXR para entrada em modo VR |
| [Tailwind CSS](https://tailwindcss.com/) | Estilização dos overlays e interface 2D |
| [Framer Motion](https://www.framer.com/motion/) | Animações dos painéis informativos |
| [Zustand](https://github.com/pmndrs/zustand) | Estado compartilhado entre cena R3F e overlays HTML |
| [Vercel](https://vercel.com/) | Deploy e hospedagem com link público |

---

## Como executar localmente

### Pré-requisitos

- Node.js 18 ou superior
- npm ou yarn

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/UsinaVR-Museu-Digital.git
cd UsinaVR-Museu-Digital

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev

# 4. Acesse no navegador
# http://localhost:3000
```

### Build para produção

```bash
npm run build
npm start
```

### Deploy na Vercel

```bash
# Com a CLI da Vercel instalada:
npm i -g vercel
vercel
```

---

## Estrutura do projeto

```
UsinaVR/
├── app/
│   ├── page.tsx               # Landing page (/)
│   ├── museu/page.tsx         # Cena 3D principal (/museu)
│   └── sobre/page.tsx         # Sobre o projeto (/sobre)
│
├── components/
│   ├── scene/                 # Componentes da cena 3D (R3F)
│   │   ├── Terrain.tsx        # Terreno com displacement map
│   │   ├── Sky.tsx            # Skybox de entardecer
│   │   ├── Vegetacao.tsx      # Árvores instanciadas
│   │   ├── Obra.tsx           # Componente genérico de obra
│   │   ├── Locomotiva.tsx     # Ponto de interesse 1
│   │   ├── FachadaUsina.tsx   # Estrutura industrial ao fundo
│   │   └── PlayerController.tsx # Navegação WASD + mouse
│   │
│   └── ui/                    # Interface 2D (overlays HTML)
│       ├── PainelFlutuante.tsx  # Painel de proximidade
│       ├── SidePanel.tsx        # Detalhes ao clicar em obra
│       ├── HUD.tsx              # Instruções de controle
│       └── BotaoVR.tsx          # Entrada em modo WebXR
│
├── data/
│   └── obras.ts               # Array tipado com dados de todas as obras
│
├── hooks/
│   └── useProximidade.ts      # Detecta qual obra está próxima do jogador
│
└── public/
    ├── models/                # Assets 3D (.glb)
    └── textures/              # Mapas de textura
```

---

## Como navegar na experiência

| Ação | Controle (Desktop) | Controle (Mobile) |
|---|---|---|
| Mover | W A S D ou setas | Botões na tela |
| Olhar | Arrastar o mouse | Girar o dispositivo |
| Interagir com obra | Clicar no objeto | Tocar no objeto |
| Fechar painel | Clicar fora / tecla Esc | Tocar fora |
| Entrar em modo VR | Botão "Entrar em VR" | Botão "Entrar em VR" |
| Sair do modo VR | Botão no headset | — |

> **Dica:** ao entrar na cena, clique na tela para ativar o controle de câmera com o mouse (PointerLock). Pressione Esc para liberar o cursor.

---

## Processo de criação e dificuldades

### Processo

O desenvolvimento seguiu uma abordagem incremental: primeiro a cena vazia com terreno e iluminação, depois os pontos de interesse posicionados, por último as interações e a interface. A centralização dos dados das obras em `data/obras.ts` foi uma decisão arquitetural que simplificou toda a implementação — qualquer componente da cena e qualquer overlay de UI acessa os mesmos dados a partir de uma única fonte.

### Dificuldades encontradas

- **Performance com vegetação densa:** resolvida com GPU Instancing via `<Instances>` do Drei, que reduz drasticamente o número de draw calls
- **PointerLock em dispositivos móveis:** a API de PointerLock não está disponível em mobile — foi necessário implementar fallback com controles por toque na tela
- **Calibração de escala:** os objetos 3D precisam fazer sentido na perspectiva em primeira pessoa; ajustes de escala foram feitos tomando o avatar padrão (~1,75 m) como referência
- **Transições suaves dos painéis:** a animação de entrada/saída dos painéis informativos exigiu atenção especial para não causar flickering no caso de o jogador entrar e sair rapidamente da zona de proximidade

---

## Melhorias futuras

- **Galeria expandida:** inclusão das 45+ obras reais do acervo com fotografias aplicadas como texturas
- **Áudio ambiental:** sons de pássaros, vento e ambiente rural do interior pernambucano com espacialização 3D
- **Modo visita guiada:** narrador virtual que acompanha o usuário pelo percurso contando a história de cada obra
- **Multiplayer:** grupos de estudantes visitando o museu simultaneamente com Photon ou Liveblocks
- **Conteúdo em libras:** integração de vídeos em Língua Brasileira de Sinais nos painéis informativos

---

## Licença

Este projeto foi desenvolvido para fins educacionais no âmbito do Hackweb Web3 — RESTIC 29. O conteúdo artístico referenciado (obras, artistas, imagens) é de propriedade da Usina de Arte e dos respectivos artistas.

---

*Desenvolvido com muito carinho para a Usina de Arte — Água Preta, Pernambuco 🌺*
