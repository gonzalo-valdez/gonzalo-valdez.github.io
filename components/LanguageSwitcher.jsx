// components/LanguageSwitcher.jsx
"use client";
import { useTranslation } from "@/hooks/useTranslation";

export default function LanguageSwitcher() {
	const { locale, setLocale } = useTranslation();

	return (
		<div className="absolute top-5 right-5 flex gap-2 z-50">
			{["en", "es"].map((l) => (
				<button
					key={l}
					onClick={() => setLocale(l)}
					className={`px-3 py-1 rounded ${
						locale === l ? "bg-gray-700 text-white" : "bg-gray-200 text-black hover:bg-gray-400 transition-all duration-200"
					}`}
				>
					{l.toUpperCase()}
				</button>
			))}
		</div>
	);
}
