import "./globals.css";
import { TranslationProvider } from "@/hooks/useTranslation";

export const metadata = {
	title: "Gonzalo Valdez",
	description: "",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className="antialiased">
				<TranslationProvider>{children}</TranslationProvider>
			</body>
		</html>
	);
}
