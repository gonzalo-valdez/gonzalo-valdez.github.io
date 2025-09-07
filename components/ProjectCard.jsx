"use client";

import { useRef, useState, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CardContainer, CardBody, CardItem } from "@/components/3d-card";

export default function ProjectCard({ project }) {
	const [expanded, setExpanded] = useState(false);
	const cardRef = useRef(null);
	const [cardRect, setCardRect] = useState(null);

	// Measure card position and size
	useLayoutEffect(() => {
		if (cardRef.current) {
			setCardRect(cardRef.current.getBoundingClientRect());
		}
	}, [expanded]);

	// Helper to render preview (video if mp4, else image)
	const renderPreview = (className = "") => {
		if (project.preview.endsWith(".mp4")) {
			return <video src={project.preview} autoPlay loop muted playsInline className={`rounded-lg w-full h-auto ${className}`} />;
		}
		return <img src={project.preview} alt={`${project.title} preview`} className={`rounded-lg w-full h-auto object-cover ${className}`} />;
	};

	return (
		<>
			{/* Original 3D Card */}
			<AnimatePresence>
				{!expanded && (
					<motion.div ref={cardRef} layoutId={`card-${project.title}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
						<CardContainer>
							<CardBody className="relative bg-black border-white/[0.2] border rounded-xl p-6 w-[22rem] h-auto group/card">
								{/* Expand button */}
								<button onClick={() => setExpanded(true)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-200 text-xl">
									<i className="bi bi-arrows-angle-expand"></i>
								</button>

								<CardItem translateZ={50} className="text-xl font-bold text-white">
									{project.title}
								</CardItem>
								<CardItem as="p" translateZ={60} className="text-sm mt-2 text-neutral-300">
									{project.description}
								</CardItem>
								<CardItem translateZ={100} rotateX={10} className="w-full mt-4">
									{renderPreview("h-48 group-hover/card:shadow-xl")}
								</CardItem>

								<div className="flex flex-wrap gap-2 mt-6">
									{project.tech?.map((tag, idx) => (
										<CardItem key={idx} translateZ={60} as="span" className="px-3 py-1 text-xs rounded-full bg-gray-700 text-white">
											{tag}
										</CardItem>
									))}
								</div>
							</CardBody>
						</CardContainer>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Fullscreen View */}
			<AnimatePresence>
				{expanded && cardRect && (
					<motion.div
						layoutId={`card-${project.title}`}
						initial={{
							top: cardRect.top,
							left: cardRect.left,
							width: cardRect.width,
							height: cardRect.height,
							position: "fixed",
							borderRadius: "0.75rem",
							backgroundColor: "#000000", // match card bg
							overflow: "hidden",
							zIndex: 50,
						}}
						animate={{
							top: 0,
							left: 0,
							width: "100vw",
							height: "100vh",
							borderRadius: 0,
							backgroundColor: "#090c14", // fullscreen bg
							transition: { duration: 0.6, ease: "easeInOut" },
						}}
						exit={{
							opacity: 0,
							transition: { duration: 0.4 },
						}}
					>
						{/* Fade content in */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1, transition: { delay: 0.3, duration: 0.5 } }}
							exit={{ opacity: 0, transition: { duration: 0.3 } }}
							className="w-full h-full flex flex-col md:flex-row items-center justify-center p-10 text-white relative"
						>
							<div className="flex-1 mb-6 md:mb-0 md:pr-10">
								<h2 className="text-4xl font-bold text-center md:text-left">{project.title}</h2>
								<div className="flex flex-wrap gap-2 justify-center md:justify-start mt-2">
									{project.tech?.map((tag, idx) => (
										<span key={idx} className="bg-gray-700 px-3 py-1 rounded-full text-sm">
											{tag}
										</span>
									))}
								</div>
								<p className="mt-6 text-gray-200 text-lg">{project.description}</p>
								{/* Extra fullscreen-only description */}
								<div className="mt-6 text-gray-200 text-lg whitespace-pre-line">{project.fullDescription}</div>
							</div>

							{/* Fullscreen 3D Card for preview */}
							<div className="flex-2">
								<CardContainer>{renderPreview("w-full h-auto")}</CardContainer>
							</div>

							<button onClick={() => setExpanded(false)} className="absolute top-15 right-15 text-white text-2xl">
								<i className="bi bi-arrows-angle-contract"></i>
							</button>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
