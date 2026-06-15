import { Rubik, Roboto_Mono } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Kakila - Link Aggregator & Product Catalog",
  description: "Temukan produk Shopee, TikTok Shop, dan E-Book eksklusif dari Nabila Muchsin. Where Modesty Meets Class.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${rubik.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-neutral-50 text-dark-slate flex flex-col font-rubik">{children}</body>
    </html>
  );
}
