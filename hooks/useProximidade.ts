import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { obras, type Obra } from "@/data/obras";
import { useMuseuStore } from "@/hooks/useMuseuStore";

export function useProximidade() {
  const { camera } = useThree();
  const setObraProxima = useMuseuStore((s) => s.setObraProxima);

  useFrame(() => {
    const pos = camera.position;
    let encontrada: Obra | null = null;
    let menorDistancia = Infinity;

    for (const obra of obras) {
      const alvo = new THREE.Vector3(...obra.posicao);
      const distancia = pos.distanceTo(alvo);
      if (distancia < obra.raioProximidade && distancia < menorDistancia) {
        encontrada = obra;
        menorDistancia = distancia;
      }
    }

    setObraProxima(encontrada);
  });
}
