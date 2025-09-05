"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise.js";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

/* === Wobbly Water Blob === */
function WobblyBlob() {
	const meshRef = useRef();
	const geometryRef = useRef();
	const simplex = useRef(new SimplexNoise());
	const originalPositions = useRef(null);
	const smoothness = 1.7;

	useFrame(({ clock }) => {
		const t = clock.getElapsedTime() * 0.5;
		if (geometryRef.current) {
			const geom = geometryRef.current;
			const posAttr = geom.attributes.position;
			if (!originalPositions.current) {
				originalPositions.current = new Float32Array(posAttr.array);
			}
			for (let i = 0; i < posAttr.count; i++) {
				const ix = i * 3;
				const ox = originalPositions.current[ix];
				const oy = originalPositions.current[ix + 1];
				const oz = originalPositions.current[ix + 2];
				const offset = simplex.current.noise3d((ox + t) / smoothness, (oy + t) / smoothness, (oz + t) / smoothness) * 0.08;
				posAttr.array[ix] = ox * (1 + offset);
				posAttr.array[ix + 1] = oy * (1 + offset);
				posAttr.array[ix + 2] = oz * (1 + offset);
			}
			posAttr.needsUpdate = true;
			geom.computeVertexNormals();
		}
		meshRef.current.position.x = Math.sin(t * 0.7);
		meshRef.current.position.y = Math.sin(t);
	});

	return (
		<mesh ref={meshRef} castShadow receiveShadow>
			<sphereGeometry ref={geometryRef} args={[2, 128, 128]} />
			<meshPhysicalMaterial
				color="#1e90ff"
				transmission={1} // fully refractive
				ior={1.33} // water
				thickness={2}
				roughness={0.08} // soft reflections
				metalness={0}
				clearcoat={0.2} // subtle wet shine
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
