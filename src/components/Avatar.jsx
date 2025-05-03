import React, { useRef, useEffect, useMemo } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export default function Avatar({ height, weight, image, hair, beard, animation }) {
  const { scene, animations } = useGLTF('/avatar_model.glb');
  const mixer = useRef();

  // Ölçeklendirme
  const scale = useMemo(() => [1, height / 170, weight / 70], [height, weight]);

  // Animasyon karıştırıcı kur
  useEffect(() => {
    if (animations.length) {
      mixer.current = new THREE.AnimationMixer(scene);
      animations.forEach(clip => mixer.current.clipAction(clip).play());
    }
  }, [animations, scene]);

  // Animasyon değişimini uygula
  useEffect(() => {
    if (!mixer.current) return;
    const clip = animations.find(a => a.name === animation);
    if (clip) {
      mixer.current.stopAllAction();
      mixer.current.clipAction(clip).play();
    }
  }, [animation, animations]);

  // Zaman güncellemesi
  useFrame((_, delta) => mixer.current && mixer.current.update(delta));

  // Texture loader
  const clothTex = useLoader(THREE.TextureLoader, image || '/placeholder.png');

  return (
    <group scale={scale}>
      <primitive object={scene} />

      {/* Kıyafet Paneli */}
      {image && (
        <mesh position={[0, 1.2, 0.26]}>  
          <planeGeometry args={[0.9, 1.2]} />
          <meshBasicMaterial map={clothTex} transparent />
        </mesh>
      )}

      {/* Saç ve Sakal basit mesh'leri (modelde de olabilir) */}
      {hair !== 'bald' && (
        <mesh position={[0, 2.3, 0]}>              
          <sphereGeometry args={[0.36, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="brown" />
        </mesh>
      )}
      {beard !== 'none' && (
        <mesh position={[0, 1.7, 0.25]} rotation={[Math.PI / 2, 0, 0]}>  
          <torusGeometry args={[0.25, 0.1, 16, 100]} />
          <meshStandardMaterial color="brown" />
        </mesh>
      )}
    </group>
  );
}