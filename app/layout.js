import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Barlow } from "next/font/google";

const barlow = Barlow({
	subsets: ["latin"],
	weight: ["200", "300", "400", "500", "600", "700"], // Customize weights as needed
	variable: "--font-barlow",
});
export const metadata = {
	title: "Gonzalo Valdez",
	description: "",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={`${barlow.className}  antialiased`}>{children}</body>
		</html>
	);
}
