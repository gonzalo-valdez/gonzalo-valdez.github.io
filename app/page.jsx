"use client";
import Hero3D from "@/components/Hero3D";
import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import { useTranslation } from "@/hooks/useTranslation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Spotlight } from "@/components/spotlight";
export default function Home() {
	const [showProjects, setShowProjects] = useState(false);
	const [buttonRect, setButtonRect] = useState(null);
	const buttonRef = useRef(null);
	const [isMounted, setIsMounted] = useState(false); // Flag to track if component is mounted
	const [fadeOut, setFadeOut] = useState(false);
	const { t } = useTranslation();
	const projects = t("projects.projectData");
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

			<LanguageSwitcher />
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
						<h1 className="text-6xl font-semibold text-white drop-shadow-lg">{t("home.title")}</h1>
						<p className="mt-4 text-xl text-gray-200 font-semibold">{t("home.subtitle")}</p>
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
						{t("home.button")}
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
							borderRadius: "20%",
						}}
						animate={{
							left: "-50%",
							top: "-50%",
							width: "200vw",
							height: "200vh",
							borderRadius: "100%",
						}}
						exit={{ opacity: 0 }}
						transition={{ duration: 1.2, ease: "easeInOut" }}
						className="absolute bg-gray-950 z-40 "
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
						className="absolute inset-0 z-40 bg-gray-950 flex flex-col items-center overflow-hidden"
					>
						<div className="w-full h-full overflow-y-auto px-4 py-16 flex flex-col items-center">
							<Spotlight />
							<h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 sm:mb-12 text-center">{t("projects.title")}</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 w-full max-w-6xl">
								{projects.map((p, i) => (
									<ProjectCard key={p.title} project={p} index={i} />
								))}
							</div>
						</div>
					</motion.section>
				)}
			</AnimatePresence>
		</main>
	);
}
