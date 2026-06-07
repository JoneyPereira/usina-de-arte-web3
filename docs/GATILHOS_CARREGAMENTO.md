## 🏗️ 1. Arquitetura da Solução

O fluxo de carregamento segue três estados principais para cada obra, controlados pela distância em relação à câmera/jogador:

Use o código com cuidado.[ Usuário ] -----------------------------> 60m+ -------------------> [ Fora de Alcance ] (Não renderiza / Descarrega da VRAM)[ Usuário ] -----------> 30m a 60m -------> [ Zona de Instalação ] (Faz o Preload do arquivo .glb em background)[ Usuário ] ➔ 0m a 30m ➔ [ Zona de Visão ] (Renderiza a obra com colisões e interações ativas)
---

## 🧠 2. Estado Global (Zustand Store)

Adicione o controle de proximidade na sua store do Zustand. Ela rastreará quais obras estão ativas no momento com base nas coordenadas (`x, y, z`).

```javascript
// src/store/useUsinaStore.js
import { create } from 'zustand'

export const useUsinaStore = create((set) => ({
  // Lista com metadados de todas as 45+ obras
  obrasCadastro: [
    { id: '1', nome: 'Coqueiro Frustrado', url: '/models/coqueiro.glb', posicao: [10, 0, -25] },
    { id: '2', nome: 'Mandacaru', url: '/models/mandacaru.glb', posicao: [85, 0, -120] },
    // Adicione as outras obras aqui...
  ],
  
  // IDs das obras que devem ser renderizadas na tela agora
  obrasAtivas: [],

  // Atualiza as obras visíveis com base na posição atual do jogador
  atualizarObrasVisiveis: (posicaoJogador) => set((state) => {
    const RAIO_VISAO = 45; // Distância em metros para renderizar a obra
    
    const ativas = state.obrasCadastro.filter((obra) => {
      const [ox, oy, oz] = obra.posicao;
      const [px, py, pz] = posicaoJogador;
      
      // Cálculo de distância Euclidiana 3D simplificado (pode desconsiderar o Y se o terreno for plano)
      const distancia = Math.sqrt(
        Math.pow(ox - px, 2) + 
        Math.pow(oz - pz, 2)
      );
      
      return distancia <= RAIO_VISAO;
    }).map(o => o.id);

    // Só atualiza o estado se a lista de IDs mudar (evita re-renders infinitos)
    if (JSON.stringify(state.obrasAtivas) !== JSON.stringify(ativas)) {
      return { obrasAtivas: ativas };
    }
    return {};
  }),
}))
```

---

## 🎮 3. Gerenciador de Proximidade (R3F Loop)

Este componente monitora a posição da câmera ou do avatar do jogador a cada quadro (`useFrame`) e avisa a Store para recalcular as distâncias, aplicando um limitador de taxa (*throttle*) para não sobrecarregar a CPU do Xeon.

```jsx
// src/components/GerenciadorProximidade.jsx
import { useFrame } from '@react-three/fiber'
import { useUsinaStore } from '@/store/useUsinaStore'
import * as THREE from 'three'

export function GerenciadorProximidade() {
  const atualizarObrasVisiveis = useUsinaStore((state) => state.atualizarObrasVisiveis)
  const posTemp = new THREE.Vector3()
  let ultimoCheck = 0

  useFrame((state) => {
    const tempoAtual = state.clock.getElapsedTime()
    
    // Executa a checagem apenas a cada 0.5 segundos (suficiente para caminhada)
    if (tempoAtual - ultimoCheck > 0.5) {
      ultimoCheck = tempoAtual
      
      // Pega a posição atual da câmera (ou do seu componente de Player)
      state.camera.getWorldPosition(posTemp)
      
      // Dispara a lógica de atualização
      atualizarObrasVisiveis([posTemp.x, posTemp.y, posTemp.z])
    }
  })

  return null
}
```

---

## 📐 4. Renderização Dinâmica no Ecossistema R3F

No seu componente de cenário principal, renderize apenas os IDs que o Zustand marcou como ativos. O próprio R3F se encarregará de limpar a VRAM (Garbage Collection) das obras que sumirem da lista.

```jsx
// src/components/Mapa3D.jsx
import { useUsinaStore } from '@/store/useUsinaStore'
import { ObraDeArte } from './ObraDeArte' // Seu componente de loader otimizado
import { GerenciadorProximidade } from './GerenciadorProximidade'

export function Mapa3D() {
  const obrasCadastro = useUsinaStore((state) => state.obrasCadastro)
  const obrasAtivas = useUsinaStore((state) => state.obrasAtivas)

  return (
    <group>
      {/* Loop de checagem em tempo real */}
      <GerenciadorProximidade />

      {/* Renderiza apenas o que está perto */}
      {obrasCadastro.map((obra) => {
        const estaAtiva = obrasAtivas.includes(obra.id)
        
        if (!estaAtiva) return null; // Descarrega completamente o componente e libera memória

        return (
          <ObraDeArte 
            key={obra.id} 
            url={obra.url} 
            position={obra.posicao} 
          />
        )
      })}
    </group>
  )
}
```

---

## 🏁 5. Pré-carregamento Avançado (Opcional para transições suaves)

Para evitar pequenas travadas (*stuttering*) exatamente no momento em que o usuário entra no raio de 45m de uma obra, você pode rodar um segundo raio de **Preload** (ex: 75 metros) usando o `useGLTF.preload(url)`.

```javascript
// Exemplo conceitual para disparar o download antes da renderização:
const RAIO_PRELOAD = 75;
if (distancia <= RAIO_PRELOAD && distancia > RAIO_VISAO) {
  useGLTF.preload(obra.url); // Baixa o arquivo para o cache do navegador em segundo plano
}
```