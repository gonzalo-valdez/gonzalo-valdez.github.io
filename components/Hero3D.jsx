"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise.js";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

/* === Wobbly Water Blob with Global Mouse Tracking === */
function WobblyBlob() {
	const meshRef = useRef();
	const geometryRef = useRef();
	const simplex = useRef(new SimplexNoise());
	const originalPositions = useRef(null);
	const smoothness = 1.7;

	// Global mouse state
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

	// Track global mouse position
	useEffect(() => {
		const handleMouseMove = (e) => {
			const x = (e.clientX / window.innerWidth) * 2 - 1; // normalize -1 to 1
			const y = -(e.clientY / window.innerHeight) * 2 + 1;
			setMousePos({ x, y });
		};
		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	useFrame(({ clock }) => {
		const t = clock.getElapsedTime() * 0.5;

		if (geometryRef.current) {
			const geom = geometryRef.current;
			const posAttr = geom.attributes.position;

			// Store original positions once
			if (!originalPositions.current) {
				originalPositions.current = new Float32Array(posAttr.array);
			}

			// Mouse influence (closer to center = stronger wobble)
			const mouseDist = 1 - Math.hypot(mousePos.x, mousePos.y);
			const mouseInfluence = 1 + mouseDist * 0.5;

			for (let i = 0; i < posAttr.count; i++) {
				const ix = i * 3;
				const ox = originalPositions.current[ix];
				const oy = originalPositions.current[ix + 1];
				const oz = originalPositions.current[ix + 2];

				const noise = simplex.current.noise3d((ox + t) / smoothness, (oy + t) / smoothness, (oz + t) / smoothness) * 0.08 * mouseInfluence;

				posAttr.array[ix] = ox * (1 + noise);
				posAttr.array[ix + 1] = oy * (1 + noise);
				posAttr.array[ix + 2] = oz * (1 + noise);
			}
			posAttr.needsUpdate = true;
			geom.computeVertexNormals();
		}

		// Smooth blob tilt
		if (meshRef.current) {
			meshRef.current.rotation.x += (-mousePos.y * 0.65 - meshRef.current.rotation.x) * 0.05;
			meshRef.current.rotation.y += (mousePos.x * 0.65 - meshRef.current.rotation.y) * 0.05;

			// subtle floating
			meshRef.current.position.x = Math.sin(t * 0.7) * 0.3;
			meshRef.current.position.y = Math.sin(t) * 0.3;
		}
	});

	return (
		<mesh ref={meshRef} castShadow receiveShadow>
			<sphereGeometry ref={geometryRef} args={[2, 128, 128]} />
			<meshPhysicalMaterial
				color="#1e90ff"
				transmission={1}
				ior={1.33}
				thickness={2}
				roughness={0.05}
				metalness={0}
				clearcoat={0.2}
				clearcoatRoughness={0.5}
				reflectivity={0.6}
				attenuationColor="#88ccee"
				attenuationDistance={5}
			/>
		</mesh>
	);
}

/* === Floating Particles === */
function Particles({ count = 300 }) {
	const mesh = useRef();
	const positions = new Float32Array(Array.from({ length: count * 3 }, () => (Math.random() - 0.6) * 60));

	useFrame(({ clock }) => {
		const t = clock.getElapsedTime() * 0.05;
		mesh.current.rotation.y = t * 0.2;
		mesh.current.rotation.x = t * 0.1;
	});

	return (
		<points ref={mesh}>
			<bufferGeometry>
				<bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
			</bufferGeometry>
			<pointsMaterial color="#ffffff" size={0.08} transparent opacity={0.5} sizeAttenuation />
		</points>
	);
}

/* === Scene === */
export default function Hero3D() {
	return (
		<Canvas camera={{ position: [0, 0, 10], fov: 50 }} shadows>
			<ambientLight intensity={0.5} />
			<directionalLight position={[5, 10, 5]} intensity={0.6} castShadow />

			<Particles count={400} />
			<WobblyBlob />

			{/* Environment = refraction source */}
			<Environment preset="forest" />

			<EffectComposer>
				<Bloom luminanceThreshold={0.4} luminanceSmoothing={0.4} intensity={0.8} />
			</EffectComposer>
		</Canvas>
	);
}
