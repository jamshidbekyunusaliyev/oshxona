import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tasty - Retseptlar",
    short_name: "Tasty",
    description: "O'zbek taomlari va dunyo oshxonalaridan retseptlar.",
    start_url: "/",
    display: "standalone",
    background_color: "#211d18",
    theme_color: "#d99c3a",
    lang: "uz",
    icons: [
      { src: "/icons/tasty-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/tasty-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/tasty-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}