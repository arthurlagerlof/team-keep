import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export default function ShipModel() {
  const containerRef = useRef(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    let renderer;
    let animationFrame;
    let controls;
    let ship;
    let disposed = false;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 1000);
      camera.position.set(0, 1.4, 5);

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      container.appendChild(renderer.domElement);

      scene.add(new THREE.HemisphereLight(0xffffff, 0x446071, 2.2));
      const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
      keyLight.position.set(-3, 5, 4);
      scene.add(keyLight);
      const rimLight = new THREE.DirectionalLight(0x8cc8df, 2);
      rimLight.position.set(4, 2, -4);
      scene.add(rimLight);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
      controls.enablePan = false;
      controls.minDistance = 2;
      controls.maxDistance = 10;
      controls.target.set(0, 0, 0);

      const resize = () => {
        const { width, height } = container.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      const observer = new ResizeObserver(resize);
      observer.observe(container);
      resize();

      new GLTFLoader().load(
        "/models/opt_rv_taani.glb",
        ({ scene: model }) => {
          if (disposed) return;
          const bounds = new THREE.Box3().setFromObject(model);
          const size = bounds.getSize(new THREE.Vector3());
          const center = bounds.getCenter(new THREE.Vector3());
          const maxDimension = Math.max(size.x, size.y, size.z);
          if (!Number.isFinite(maxDimension) || maxDimension <= 0) {
            setError(true);
            return;
          }

          const normalizedModel = new THREE.Group();
          normalizedModel.position.copy(center).multiplyScalar(-1);
          normalizedModel.add(model);
          ship = new THREE.Group();
          ship.add(normalizedModel);
          ship.scale.setScalar(2.4 / maxDimension);
          scene.add(ship);

          const framedBounds = new THREE.Box3().setFromObject(ship);
          const framedSize = framedBounds.getSize(new THREE.Vector3());
          const framedCenter = framedBounds.getCenter(new THREE.Vector3());
          const radius = framedSize.length() / 2;
          const distance = radius / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2));
          camera.position.copy(framedCenter).add(new THREE.Vector3(0, radius * 0.55, distance * 1.08));
          camera.near = Math.max(0.01, distance / 100);
          camera.far = distance * 100;
          camera.updateProjectionMatrix();
          controls.target.copy(framedCenter);
          controls.minDistance = Math.max(0.2, radius * 1.2);
          controls.maxDistance = distance * 4;
          controls.update();
        },
        undefined,
        (loadError) => {
          console.error("Unable to load the ship model", loadError);
          if (!disposed) setError(true);
        },
      );

      const clock = new THREE.Clock();
      const render = () => {
        animationFrame = requestAnimationFrame(render);
        const time = clock.getElapsedTime();
        if (ship) {
          ship.rotation.z = Math.sin(time * 1) * 0.055;
          ship.rotation.x = Math.sin(time * 0.7 + 1) * 0.025;
          ship.position.y = Math.sin(time * 1) * 0.035;
        }
        controls.update();
        renderer.render(scene, camera);
      };
      render();

      return () => {
        disposed = true;
        cancelAnimationFrame(animationFrame);
        observer.disconnect();
        controls.dispose();
        renderer.dispose();
        renderer.domElement.remove();
        scene.traverse((object) => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
              for (const value of Object.values(material)) {
                if (value?.isTexture) value.dispose();
              }
              material.dispose();
            }
          }
        });
      };
    } catch {
      setError(true);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      controls?.dispose();
      renderer?.dispose();
      renderer?.domElement.remove();
    };
  }, []);

  return (
    <div className="ship-model-wrap">
      <div
        ref={containerRef}
        className="ship-model"
        role="img"
        aria-label="Interactive 3D model of a small ship; drag to rotate and scroll to zoom"
      />
      {error && <p className="ship-model-error">The ship model could not be loaded.</p>}
      <span className="ship-model-hint" aria-hidden="true">Drag to explore</span>
    </div>
  );
}
