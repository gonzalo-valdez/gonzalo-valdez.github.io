// hooks/useTranslation.jsx
"use client";

import { createContext, useContext, useState } from "react";
import en from "@/locales/en.json";
import es from "@/locales/es.json";

const translations = { en, es };

const TranslationContext = createContext();

export function TranslationProvider({ children }) {
	const [locale, setLocale] = useState("en"); // default language

	const t = (key) => {
		const keys = key.split(".");
		let value = translations[locale];
		keys.forEach((k) => {
			if (value) value = value[k];
		});
		return value || key;
	};

	return <TranslationContext.Provider value={{ t, locale, setLocale }}>{children}</TranslationContext.Provider>;
}

export function useTranslation() {
	const context = useContext(TranslationContext);
	if (!context) throw new Error("useTranslation must be used within TranslationProvider");
	return context;
}
