import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeGear() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Fallback to default dimensions if container size is not computed yet (e.g. during page transition)
    let width = container.clientWidth || 300;
    let height = container.clientHeight || 300;

    let scene, camera, renderer, reqId;
    let ringGeo1, ringMat1, ringGeo2, ringMat2, ringGeo3, ringMat3, coreGeo, coreMat;
    let clock;

    try {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
      camera.position.z = 6;

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // Create 3 Nested Gyroscopic / Mechanical Rings
      // Ring 1 (Outer - Gold)
      ringGeo1 = new THREE.TorusGeometry(1.6, 0.12, 8, 36);
      ringMat1 = new THREE.MeshBasicMaterial({
        color: 0xd4af37,
        wireframe: true,
        transparent: true,
        opacity: 0.2,
      });
      const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
      scene.add(ring1);

      // Ring 2 (Middle - Purple)
      ringGeo2 = new THREE.TorusGeometry(1.15, 0.08, 6, 28);
      ringMat2 = new THREE.MeshBasicMaterial({
        color: 0x7c3aed,
        wireframe: true,
        transparent: true,
        opacity: 0.18,
      });
      const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
      scene.add(ring2);

      // Ring 3 (Inner - Cyan)
      ringGeo3 = new THREE.TorusGeometry(0.7, 0.05, 6, 20);
      ringMat3 = new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        wireframe: true,
        transparent: true,
        opacity: 0.22,
      });
      const ring3 = new THREE.Mesh(ringGeo3, ringMat3);
      scene.add(ring3);

      // Add a central core sphere
      coreGeo = new THREE.OctahedronGeometry(0.25, 0);
      coreMat = new THREE.MeshBasicMaterial({
        color: 0xd4af37,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      scene.add(core);

      clock = new THREE.Clock();

      const animate = () => {
        reqId = requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        // Gyroscopic movements
        ring1.rotation.y = elapsed * 0.15;
        ring1.rotation.x = elapsed * 0.05;

        ring2.rotation.x = -elapsed * 0.25;
        ring2.rotation.z = elapsed * 0.12;

        ring3.rotation.z = -elapsed * 0.35;
        ring3.rotation.y = elapsed * 0.20;

        core.rotation.x = elapsed * 0.5;
        core.rotation.y = -elapsed * 0.5;

        renderer.render(scene, camera);
      };

      animate();
    } catch (e) {
      console.warn('WebGL context failed to initialize or is not supported: ', e);
    }

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || 300;
      const h = container.clientHeight || 300;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Trigger a resize check after 100ms to correct transition offsets
    const resizeTimeout = setTimeout(handleResize, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      if (reqId) cancelAnimationFrame(reqId);
      if (renderer) {
        if (container && renderer.domElement && renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }
      if (ringGeo1) ringGeo1.dispose();
      if (ringMat1) ringMat1.dispose();
      if (ringGeo2) ringGeo2.dispose();
      if (ringMat2) ringMat2.dispose();
      if (ringGeo3) ringGeo3.dispose();
      if (ringMat3) ringMat3.dispose();
      if (coreGeo) coreGeo.dispose();
      if (coreMat) coreMat.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full min-h-[350px] md:min-h-[400px] flex items-center justify-center opacity-70" 
    />
  );
}
