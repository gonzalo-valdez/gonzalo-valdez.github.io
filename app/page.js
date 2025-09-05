"use client";
import Hero3D from "@/components/Hero3D";
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
	const [showProjects, setShowProjects] = useState(false);
	const [buttonRect, setButtonRect] = useState(null);
	const buttonRef = useRef(null);
	const [isMounted, setIsMounted] = useState(false); // Flag to track if component is mounted
	const [fadeOut, setFadeOut] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setIsMounted(true);
			setTimeout(() => {
				setFadeOut(true);
			}, 800);
		}, 200);
	}, [isMounted]);
	// Get button position on mount
	useLayoutEffect(() => {
		if (buttonRef.current) {
			const rect = buttonRef.current.getBoundingClientRect();
			setButtonRect(rect);
		}
	}, []);

	return (
		<main className="relative flex items-center justify-center h-screen bg-gray-900 overflow-hidden font-barlow flex-col">
			<div
				className={`z-60 absolute w-full h-full bg-black transition-opacity ease-in-out duration-800 ${isMounted ? "opacity-0" : "opacity-100"} ${
					fadeOut ? "hidden" : "block"
				}`}
			/>
			{/* Hero3D stays until overlay finishes */}
			<AnimatePresence>
				{!showProjects && (
					<motion.div
						initial={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.8, ease: "easeInOut", delay: 1.2 }} // wait until overlay finishes
						className="absolute w-full h-full"
					>
						<Hero3D />
					</motion.div>
				)}
			</AnimatePresence>
			{/* Intro container with fade-out */}
			<AnimatePresence>
				{!showProjects && (
					<motion.div
						initial={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.6, ease: "easeInOut", delay: 1.2 }}
						className="relative z-30 text-center"
					>
						<h1 className="text-6xl font-semibold text-white drop-shadow-lg">Gonzalo Valdez</h1>
						<p className="mt-4 text-xl text-gray-200 font-semibold">Full-Stack Developer</p>
					</motion.div>
				)}
			</AnimatePresence>
			<AnimatePresence>
				{!showProjects && (
					<motion.button
						ref={buttonRef}
						onClick={() => setShowProjects(true)}
						initial={{ opacity: 1, backgroundColor: "#1f2937" }}
						animate={{ backgroundColor: "#1f2937" }}
						exit={{ backgroundColor: "transparent", opacity: 0 }}
						whileHover={{ backgroundColor: "#111827", transition: { duration: 0.3 } }}
						transition={{ duration: 0.6, ease: "easeInOut", delay: 0.7 }}
						className="mt-8 px-6 py-3 text-white font-semibold rounded-xl shadow-lg relative z-50 cursor-pointer"
					>
						View My Work
					</motion.button>
				)}
			</AnimatePresence>
			{/* Overlay transition */}
			<AnimatePresence>
				{showProjects && buttonRect && (
					<motion.div
						initial={{
							left: buttonRect.left,
							top: buttonRect.top,
							width: buttonRect.width,
							height: buttonRect.height,
							borderRadius: "0.75rem",
						}}
						animate={{
							left: 0,
							top: 0,
							width: "100vw",
							height: "100vh",
							borderRadius: "0rem",
						}}
						exit={{ opacity: 0 }}
						transition={{ duration: 1.2, ease: "easeInOut" }}
						className="absolute bg-gray-950 z-40"
					/>
				)}
			</AnimatePresence>
			{/* Projects View */}
			<AnimatePresence>
				{showProjects && (
					<motion.section
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.8, duration: 0.6 }}
						className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-gray-950 px-6 py-20"
					>
						<h2 className="text-4xl font-bold text-white mb-12">My Projects</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl">
							{["Project A", "Project B", "Project C"].map((p, i) => (
								<motion.div
									key={p}
									initial={{ opacity: 0, y: 30 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 1 + i * 0.2 }}
									className="bg-gray-800 rounded-xl shadow-lg p-6 hover:scale-105 transition"
								>
									<h3 className="text-2xl font-semibold text-white">{p}</h3>
									<p className="text-gray-300 mt-2">Short description about {p}.</p>
								</motion.div>
							))}
						</div>
					</motion.section>
				)}
			</AnimatePresence>
		</main>
	);
}
