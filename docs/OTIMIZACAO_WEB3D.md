# 🚀 Guia de Otimização Web3D: UsinaVR

Este documento serve como referência para manter a alta performance do projeto **UsinaVR** durante a expansão do acervo (45+ obras), reduzindo o consumo de memória (RAM/VRAM) e o tempo de carregamento.

---

## 📦 1. Otimização de Assets (.glb) - Meta: < 5MB por obra

Modelos de 20MB são inviáveis para a web. Devemos aplicar a compressão **Draco**, que reduz o tamanho dos arquivos em até 80% sem perda perceptível de qualidade visual.

### Passo a Passo de Compressão:
1. Instale a ferramenta globalmente ou execute via `npx`:
   ```bash
   npx gltf-pipeline -i public/models/obra_original.glb -o public/models/obra_otimizada.glb -d
   ```
   *(O argumento `-d` aplica a compressão Draco)*

2. Mova a pasta de decodificação do Draco para o seu diretório público:
   * Copie a pasta em: `node_modules/three/examples/jsm/libs/draco/`
   * Cole em: `public/draco/`

---

## 🛠️ 2. Implementação no React Three Fiber (R3F)

Substitua o carregamento padrão por este padrão otimizado com suporte a Draco e pré-carregamento em segundo plano (*prefetching*).

```jsx
import { useGLTF, Detailed } from '@react-three/drei'
import { useMemo } from 'react'

// Configura o caminho do decodificador globalmente (fora do componente)
useGLTF.setDecoderPath('/draco/')

export function ObraDeArte({ url, ...props }) {
  // 1. Carrega o modelo comprimido com cache automático do Drei
  const { scene } = useGLTF(url)

  // 2. Clone seguro para evitar mutações compartilhadas de materiais
  const clonedScene = useMemo(() => scene.clone(), [scene])

  return <primitive object={clonedScene} {...props} />
}

// 3. PREFETCHING: Carregue as obras principais antes do usuário interagir
useGLTF.preload('/models/obra_principal_draco.glb')
```

---

## ⚡ 3. Gerenciamento de Chunks e Desativação de SSR (Next.js 14)

O Next.js tenta renderizar tudo no servidor (SSR). Como o Three.js depende exclusivamente da API do navegador (`window`, `document`, `WebGL`), o Canvas **deve** ser carregado de forma assíncrona e apenas no cliente. Isso divide o código em *chunks* menores e acelera o carregamento inicial da página.

Modifique o arquivo onde você renderiza o `<Canvas>` (ex: `page.js` ou componente de visualização):

```jsx
import dynamic from 'next/dynamic'

// Carrega o componente do mapa 3D de forma dinâmica
// ssr: false impede o Next.js de processar o Three.js no servidor
const CanvasContainer3D = dynamic(
  () => import('@/components/CanvasContainer3D'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-900">
        <p className="text-white animate-pulse">Carregando UsinaVR...</p>
      </div>
    )
  }
)

export default function Page() {
  return (
    <main className="relative w-full h-screen">
      {/* Interface HTML normal carrega instantaneamente */}
      <CanvasContainer3D />
    </main>
  )
}
```

---

## 🌿 4. Estrutura de Instanciamento Dinâmico (LOD)

Para gerenciar as 45+ obras no cenário, use o nível de detalhe dinâmico baseado na distância da câmera do usuário:

```jsx
export function ObraComLOD({ posicao }) {
  const alta = useGLTF('/models/obra_high.glb')
  const baixa = useGLTF('/models/obra_low.glb') // Versão com poucos polígonos para visualização à distância

  return (
    <Detailed distances={[0, 45]} position={posicao}>
      {/* Perto (0m a 45m) */}
      <primitive object={alta.scene} />
      {/* Longe (Mais de 45m) */}
      <primitive object={baixa.scene} />
    </Detailed>
  )
}
```

---

## 📈 Checklist de Performance no Blender antes de Exportar:
- [ ] **Bake de Iluminação:** Luzes estáticas (iluminação geral da Usina) devem viradas texturas em vez de usar luzes em tempo real no R3F.
- [ ] **Texturas em formato WebP/JPG:** Nunca exporte com texturas em PNG se não houver transparência. Limite o tamanho delas em 1K (1024x1024) ou 2K no máximo para peças principais.
- [ ] **Limpeza de Materiais:** Garanta que múltiplos objetos compartilhem o mesmo material gráfico sempre que possível para reduzir *Draw Calls*.
