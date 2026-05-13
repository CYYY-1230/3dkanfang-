import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { DecorStyle } from "../types";

type RoomKey = "living" | "bedroom" | "kitchen";

type ThreeRoomViewerProps = {
  decorStyle: DecorStyle;
  activeRoom: RoomKey;
};

const cameraPositions: Record<RoomKey, [number, number, number]> = {
  living: [5.2, 3.2, 6],
  bedroom: [-5.4, 3.1, 4.2],
  kitchen: [4.8, 3.4, -4.7],
};

export function ThreeRoomViewer({ decorStyle, activeRoom }: ThreeRoomViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#f8faf7");

    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
    camera.position.set(...cameraPositions[activeRoom]);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 1.3, 0);
    controls.minDistance = 4;
    controls.maxDistance = 12;
    controls.maxPolarAngle = Math.PI / 2.08;

    const floorMaterial = new THREE.MeshStandardMaterial({
      color: decorStyle.floor,
      roughness: 0.65,
      metalness: 0.05,
    });
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: decorStyle.wall,
      roughness: 0.8,
    });
    const accentMaterial = new THREE.MeshStandardMaterial({
      color: decorStyle.accent,
      roughness: 0.42,
      metalness: 0.18,
    });
    const softMaterial = new THREE.MeshStandardMaterial({
      color: "#f9faf6",
      roughness: 0.75,
    });
    const glassMaterial = new THREE.MeshStandardMaterial({
      color: "#9fc5d3",
      transparent: true,
      opacity: 0.38,
      roughness: 0.12,
    });

    const roomGroup = new THREE.Group();
    scene.add(roomGroup);

    const floor = new THREE.Mesh(new THREE.BoxGeometry(8.6, 0.12, 7.2), floorMaterial);
    floor.position.y = -0.06;
    floor.receiveShadow = true;
    roomGroup.add(floor);

    const backWall = new THREE.Mesh(new THREE.BoxGeometry(8.6, 3.2, 0.16), wallMaterial);
    backWall.position.set(0, 1.6, -3.6);
    backWall.receiveShadow = true;
    roomGroup.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.16, 3.2, 7.2), wallMaterial);
    leftWall.position.set(-4.3, 1.6, 0);
    leftWall.receiveShadow = true;
    roomGroup.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.16, 3.2, 7.2), wallMaterial);
    rightWall.position.set(4.3, 1.6, 0);
    rightWall.receiveShadow = true;
    roomGroup.add(rightWall);

    const windowFrame = new THREE.Mesh(new THREE.BoxGeometry(2.9, 1.35, 0.08), glassMaterial);
    windowFrame.position.set(1.6, 1.95, -3.69);
    roomGroup.add(windowFrame);

    const sofa = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.75, 0.92), softMaterial);
    sofa.position.set(-1.1, 0.42, 1.65);
    sofa.castShadow = true;
    sofa.receiveShadow = true;
    roomGroup.add(sofa);

    const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.95, 0.24), softMaterial);
    sofaBack.position.set(-1.1, 0.94, 2.1);
    sofaBack.castShadow = true;
    roomGroup.add(sofaBack);

    const table = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.25, 0.8), accentMaterial);
    table.position.set(-0.8, 0.34, 0.3);
    table.castShadow = true;
    roomGroup.add(table);

    const bed = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.5, 2.1), softMaterial);
    bed.position.set(-2.85, 0.32, -1.35);
    bed.castShadow = true;
    bed.receiveShadow = true;
    roomGroup.add(bed);

    const bedHead = new THREE.Mesh(new THREE.BoxGeometry(2.05, 1, 0.2), accentMaterial);
    bedHead.position.set(-2.85, 0.88, -2.45);
    bedHead.castShadow = true;
    roomGroup.add(bedHead);

    const kitchen = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.86, 2.25), accentMaterial);
    kitchen.position.set(3.45, 0.46, -1.2);
    kitchen.castShadow = true;
    kitchen.receiveShadow = true;
    roomGroup.add(kitchen);

    const island = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.72, 0.82), softMaterial);
    island.position.set(2.15, 0.4, 0.58);
    island.castShadow = true;
    roomGroup.add(island);

    const rug = new THREE.Mesh(
      new THREE.CylinderGeometry(1.38, 1.38, 0.035, 48),
      new THREE.MeshStandardMaterial({ color: decorStyle.accent, roughness: 0.9 }),
    );
    rug.scale.z = 0.62;
    rug.position.set(-0.8, 0.03, 0.35);
    rug.receiveShadow = true;
    roomGroup.add(rug);

    const ambientLight = new THREE.HemisphereLight("#ffffff", "#b9c5b7", 1.5);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight("#fff7e8", 2.8);
    sunLight.position.set(2.6, 5.2, 4.3);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(1024, 1024);
    scene.add(sunLight);

    const warmLamp = new THREE.PointLight(decorStyle.accent, 1.4, 6);
    warmLamp.position.set(-2.8, 2.1, 1.7);
    scene.add(warmLamp);

    const handleResize = () => {
      const { width, height } = container.getBoundingClientRect();
      const safeHeight = Math.max(height, 280);
      camera.aspect = width / safeHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(width, safeHeight, false);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    handleResize();

    let animationFrame = 0;
    const animate = () => {
      animationFrame = window.requestAnimationFrame(animate);
      roomGroup.rotation.y += 0.0014;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, [decorStyle, activeRoom]);

  return <div className="three-viewer" ref={containerRef} aria-label="3D 房间示意区域" />;
}
