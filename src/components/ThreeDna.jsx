import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeDna() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Fallback to default dimensions if container size is not computed yet (e.g. during page transition)
    let width = container.clientWidth || 300;
    let height = container.clientHeight || 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // DNA helix creation parameters
    const numPoints = 60;
    const radius = 1.3;
    const heightScale = 0.08;
    const helixOffset = Math.PI;

    const strand1Group = new THREE.Group();
    const strand2Group = new THREE.Group();
    const rungsGroup = new THREE.Group();
    const dnaGroup = new THREE.Group();

    const sphereGeo = new THREE.SphereGeometry(0.06, 12, 12);
    const blueMat = new THREE.MeshBasicMaterial({ color: 0xd4af37 });
    const goldMat = new THREE.MeshBasicMaterial({ color: 0x7c3aed });
    const lineMat = new THREE.LineBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.25 });

    // Arrays to hold coordinates for lines
    const pointsStrand1 = [];
    const pointsStrand2 = [];

    for (let i = 0; i < numPoints; i++) {
      const t = i * 0.25;
      const y = (i - numPoints / 2) * heightScale;

      // Strand 1
      const x1 = radius * Math.cos(t);
      const z1 = radius * Math.sin(t);
      const p1 = new THREE.Vector3(x1, y, z1);
      pointsStrand1.push(p1);

      const node1 = new THREE.Mesh(sphereGeo, blueMat);
      node1.position.copy(p1);
      strand1Group.add(node1);

      // Strand 2
      const x2 = radius * Math.cos(t + helixOffset);
      const z2 = radius * Math.sin(t + helixOffset);
      const p2 = new THREE.Vector3(x2, y, z2);
      pointsStrand2.push(p2);

      const node2 = new THREE.Mesh(sphereGeo, goldMat);
      node2.position.copy(p2);
      strand2Group.add(node2);

      // Rungs/Connectors every few steps
      if (i % 2 === 0) {
        const rungGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
        const rung = new THREE.Line(rungGeo, lineMat);
        rungsGroup.add(rung);
      }
    }

    dnaGroup.add(strand1Group);
    dnaGroup.add(strand2Group);
    dnaGroup.add(rungsGroup);
    scene.add(dnaGroup);

    // Soft lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    let reqId;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Spin the entire DNA structure
      dnaGroup.rotation.y = elapsed * 0.35;
      dnaGroup.rotation.x = Math.sin(elapsed * 0.2) * 0.15; // Slow sway
      dnaGroup.position.y = Math.sin(elapsed * 0.5) * 0.15; // Slow float

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
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
      cancelAnimationFrame(reqId);
      if (container && renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      sphereGeo.dispose();
      blueMat.dispose();
      goldMat.dispose();
      lineMat.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full min-h-[350px] md:min-h-[450px] flex items-center justify-center" 
    />
  );
}
