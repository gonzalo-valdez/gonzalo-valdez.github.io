/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "export",
	images: { unoptimized: true },
	basePath: "/portfolio",
	assetPrefix: "/portfolio/",
	experimental: {
		optimizeCss: true,
		optimizeFonts: false,
	},
};

export default nextConfig;
