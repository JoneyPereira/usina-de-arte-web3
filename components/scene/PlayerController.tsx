"use client";

import { PointerLockControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const VELOCIDADE = 8;
const ALTURA_OLHOS = 1.7;

export function PlayerController() {
  const { camera } = useThree();
  const teclas = useRef<Record<string, boolean>>({});
  const direction = useRef(new THREE.Vector3());
  const frente = useRef(new THREE.Vector3());
  const lado = useRef(new THREE.Vector3());

  useEffect(() => {
    camera.position.set(0, ALTURA_OLHOS, 12);

    const onDown = (e: KeyboardEvent) => {
      teclas.current[e.code] = true;
    };
    const onUp = (e: KeyboardEvent) => {
      teclas.current[e.code] = false;
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [camera]);

  useFrame((_, delta) => {
    const t = teclas.current;
    const indoFrente = t["KeyW"] || t["ArrowUp"];
    const indoTras = t["KeyS"] || t["ArrowDown"];
    const indoEsq = t["KeyA"] || t["ArrowLeft"];
    const indoDir = t["KeyD"] || t["ArrowRight"];

    direction.current.set(0, 0, 0);

    camera.getWorldDirection(frente.current);
    frente.current.y = 0;
    frente.current.normalize();
    lado.current.crossVectors(frente.current, camera.up).normalize();

    if (indoFrente) direction.current.add(frente.current);
    if (indoTras) direction.current.sub(frente.current);
    if (indoDir) direction.current.add(lado.current);
    if (indoEsq) direction.current.sub(lado.current);

    if (direction.current.lengthSq() > 0) {
      direction.current.normalize().multiplyScalar(VELOCIDADE * delta);
      camera.position.add(direction.current);
    }

    camera.position.y = ALTURA_OLHOS;

    // Limites de cena
    const LIMITE = 180;
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -LIMITE, LIMITE);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -LIMITE, LIMITE);
  });

  return <PointerLockControls />;
}
