import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeGlobe() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Fallback to default dimensions if container size is not computed yet (e.g. during page transition)
    let width = container.clientWidth || 300;
    let height = container.clientHeight || 300;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 8;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create 3D Outer Wireframe Globe (Icosahedron)
    const outerGeo = new THREE.IcosahedronGeometry(2.5, 1);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    scene.add(outerMesh);

    // Create 3D Inner Wireframe Globe
    const innerGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x7c3aed,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerMesh);

    // Add particle points around it
    const pointsCount = 100;
    const pointsGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(pointsCount * 3);

    for (let i = 0; i < pointsCount * 3; i += 3) {
      // Random coordinates in a sphere
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 2.8 + Math.random() * 0.5; // Outer shell radius
      positions[i] = r * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = r * Math.cos(phi);
    }

    pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pointsMat = new THREE.PointsMaterial({
      color: 0x06b6d4,
      size: 0.04,
      transparent: true,
      opacity: 0.7,
    });
    const points = new THREE.Points(pointsGeo, pointsMat);
    scene.add(points);

    // Mouse Tracking for Parallax
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMouseMove = (e) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      // Normalised coordinates (-1 to 1)
      targetX = (e.clientX - windowHalfX) / windowHalfX;
      targetY = (e.clientY - windowHalfY) / windowHalfY;
    };

    window.addEventListener('mousemove', onMouseMove);

    // Animation Loop
    let reqId;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      
      const elapsedTime = clock.getElapsedTime();

      // Rotating geometries
      outerMesh.rotation.y = elapsedTime * 0.08;
      outerMesh.rotation.x = elapsedTime * 0.05;

      innerMesh.rotation.y = -elapsedTime * 0.12;
      innerMesh.rotation.x = -elapsedTime * 0.07;

      points.rotation.y = elapsedTime * 0.03;

      // Mouse Parallax smooth lerp (opposite to cursor direction)
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      scene.rotation.y = -currentX * 0.6;
      scene.rotation.x = -currentY * 0.6;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
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

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      cancelAnimationFrame(reqId);
      if (container && renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      outerGeo.dispose();
      outerMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      pointsGeo.dispose();
      pointsMat.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full min-h-[350px] md:min-h-[500px] flex items-center justify-center opacity-85" 
    />
  );
}
