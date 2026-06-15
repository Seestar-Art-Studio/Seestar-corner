"use client";

import { useState } from "react";
import Image from "next/image";
import { MOCK_PRODUCTS, PROFILE_DATA } from "@/data/mockProducts";

export default function Home() {
  const [activePhase, setActivePhase] = useState("LINK_TREE"); // 'LINK_TREE' | 'CATALOG'
  const [selectedPlatform, setSelectedPlatform] = useState("SHOPEE"); // 'SHOPEE' | 'TIKTOK' | 'EBOOK'
  const [searchQuery, setSearchQuery] = useState("");

  // Handler to navigate to Catalog
  const openCatalog = (platform) => {
    setSelectedPlatform(platform);
    setSearchQuery("");
    setActivePhase("CATALOG");
  };

  // Filter products based on platform and search query (matches code or title)
  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesPlatform = product.platform === selectedPlatform;
    const matchesSearch =
      searchQuery.trim() === "" ||
      product.product_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesSearch && product.is_active;
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-8 px-4 sm:py-12 bg-gradient-to-tr from-[#f3e9eb] via-[#e8eff0] to-[#f5eff0]">
      {/* Mobile-first main container */}
      <div className="w-full max-w-md bg-pure-white rounded-3xl shadow-xl overflow-hidden border border-muted-sage/20 flex flex-col custom-transition min-h-[720px]">
        {/* Phase 1: Linktree View */}
        {activePhase === "LINK_TREE" && (
          <div className="flex flex-col flex-1">
            {/* Header Block */}
            <div className="bg-dark-slate text-pure-white px-6 py-10 flex flex-col items-center text-center relative overflow-hidden">
              {/* Decorative subtle background shape */}
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-earthy-mauve/20 blur-xl"></div>
              <div className="absolute -bottom-16 -left-16 w-36 h-36 rounded-full bg-muted-sage/20 blur-xl"></div>

              {/* Profile Image with Ring */}
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-dusty-rose shadow-md mb-4 group">
                <img
                  src={PROFILE_DATA.avatar_url}
                  alt={PROFILE_DATA.display_name}
                  className="w-full h-full object-cover custom-transition group-hover:scale-110"
                />
              </div>

              {/* Display Name */}
              <h1 className="text-2xl font-bold tracking-tight font-rubik mb-1">
                {PROFILE_DATA.display_name}
              </h1>

              {/* Tagline */}
              <p className="text-sm font-medium text-dusty-rose font-rubik tracking-wide">
                {PROFILE_DATA.tagline}
              </p>
            </div>

            {/* Content Stack */}
            <div className="flex-1 px-6 py-8 flex flex-col justify-between">
              {/* Main Stack of Buttons */}
              <div className="space-y-4">
                {/* Button 1: E-Book */}
                <a
                  href="https://lynk.id/nabila"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full rounded-full bg-earthy-mauve hover:bg-dark-slate text-pure-white py-4 px-6 font-semibold text-center shadow-md hover:shadow-lg transform active:scale-98 custom-transition group"
                >
                  <svg
                    className="w-5 h-5 mr-3 text-dusty-rose group-hover:text-pure-white custom-transition"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <span>Beli E-Book Nabila</span>
                </a>

                {/* Button 2: Shopee */}
                <button
                  onClick={() => openCatalog("SHOPEE")}
                  className="flex items-center justify-center w-full rounded-full border-2 border-dark-slate hover:bg-dark-slate text-dark-slate hover:text-pure-white py-4 px-6 font-semibold text-center cursor-pointer select-none active:scale-98 custom-transition group"
                >
                  <svg
                    className="w-5 h-5 mr-3 text-earthy-mauve group-hover:text-pure-white custom-transition"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <span>Lihat Produk Shopee</span>
                </button>

                {/* Button 3: TikTok */}
                <button
                  onClick={() => openCatalog("TIKTOK")}
                  className="flex items-center justify-center w-full rounded-full border-2 border-dark-slate hover:bg-dark-slate text-dark-slate hover:text-pure-white py-4 px-6 font-semibold text-center cursor-pointer select-none active:scale-98 custom-transition group"
                >
                  <svg
                    className="w-5 h-5 mr-3 text-muted-sage group-hover:text-pure-white custom-transition"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4"
                    />
                  </svg>
                  <span>Lihat Produk TikTok Shop</span>
                </button>

                {/* Ebook Catalog Alternative Button */}
                <button
                  onClick={() => openCatalog("EBOOK")}
                  className="flex items-center justify-center w-full rounded-full border-2 border-dashed border-muted-sage hover:border-dark-slate text-dark-slate py-3 px-6 font-medium text-sm text-center cursor-pointer select-none active:scale-98 custom-transition"
                >
                  Katalog E-Book Eksklusif
                </button>
              </div>

              {/* Footer Links */}
              <div className="mt-12 text-center">
                <p className="text-xs text-muted-sage font-rubik tracking-wider uppercase">
                  Kakila © 2026
                </p>
                <div className="mt-2 flex items-center justify-center space-x-4">
                  <a
                    href="/admin"
                    className="text-xs text-earthy-mauve hover:text-dark-slate font-semibold custom-transition underline underline-offset-4"
                  >
                    Admin Dashboard
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Phase 2: Catalog View */}
        {activePhase === "CATALOG" && (
          <div className="flex flex-col flex-1">
            {/* Top Navigation & Title */}
            <div className="p-6 bg-pure-white border-b border-muted-sage/10 sticky top-0 z-10 glass-morphism">
              <button
                onClick={() => setActivePhase("LINK_TREE")}
                className="flex items-center text-sm font-semibold text-dark-slate hover:text-earthy-mauve custom-transition mb-4 cursor-pointer select-none"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Kembali ke Menu Utama
              </button>

              <h2 className="text-xl font-bold font-rubik text-dark-slate flex items-center">
                {selectedPlatform === "SHOPEE" && (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 mr-2"></span>
                    Katalog Produk Shopee
                  </>
                )}
                {selectedPlatform === "TIKTOK" && (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-black mr-2"></span>
                    Katalog Produk TikTok Shop
                  </>
                )}
                {selectedPlatform === "EBOOK" && (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-earthy-mauve mr-2"></span>
                    Katalog E-Book Kakila
                  </>
                )}
              </h2>
            </div>

            {/* Filter and Search Section */}
            <div className="px-6 py-4 bg-neutral-50/50">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ketik Kode / Nama Produk..."
                  className="w-full bg-pure-white border border-muted-sage/40 rounded-full py-3 pl-11 pr-4 text-sm font-roboto-mono placeholder-muted-sage focus:outline-none focus:ring-2 focus:ring-earthy-mauve/30 focus:border-earthy-mauve custom-transition"
                />
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-4.5 w-4.5 text-muted-sage"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-sage hover:text-dark-slate"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Product Grid Area */}
            <div className="flex-1 p-6 overflow-y-auto max-h-[500px]">
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {filteredProducts.map((product) => (
                    <a
                      key={product.id}
                      href={product.redirect_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-pure-white border border-muted-sage/20 rounded-2xl overflow-hidden hover:shadow-md hover:border-earthy-mauve/40 transform hover:-translate-y-0.5 custom-transition flex flex-col"
                    >
                      {/* Image Frame */}
                      <div className="relative aspect-square bg-neutral-100 overflow-hidden w-full">
                        <img
                          src={product.image_url}
                          alt={product.title}
                          className="w-full h-full object-cover custom-transition group-hover:scale-105"
                          loading="lazy"
                        />
                        {/* Platform Badge overlay */}
                        <div className="absolute top-2 right-2 bg-pure-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] font-bold text-dark-slate shadow-xs">
                          {product.product_code}
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-3 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-xs font-semibold font-rubik text-dark-slate leading-tight line-clamp-2 mb-1 group-hover:text-earthy-mauve custom-transition">
                            {product.title}
                          </h3>
                        </div>
                        <div className="pt-2 flex items-center justify-between border-t border-muted-sage/5">
                          <span className="text-[10px] font-roboto-mono text-earthy-mauve font-bold">
                            {product.product_code}
                          </span>
                          <span className="text-[10px] font-semibold font-rubik text-muted-sage group-hover:text-dark-slate flex items-center">
                            Beli
                            <svg
                              className="w-2.5 h-2.5 ml-1 transform group-hover:translate-x-0.5 custom-transition"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <svg
                    className="w-12 h-12 text-muted-sage/40 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm font-semibold text-dark-slate">
                    Produk tidak ditemukan
                  </p>
                  <p className="text-xs text-muted-sage mt-1">
                    Coba masukkan kata kunci atau kode produk lain.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Switch Platform at Bottom */}
            <div className="p-4 bg-neutral-50 border-t border-muted-sage/10 flex items-center justify-around">
              <button
                onClick={() => {
                  setSelectedPlatform("SHOPEE");
                  setSearchQuery("");
                }}
                className={`text-xs font-semibold py-1.5 px-4 rounded-full custom-transition ${
                  selectedPlatform === "SHOPEE"
                    ? "bg-dark-slate text-pure-white shadow-xs"
                    : "text-muted-sage hover:text-dark-slate"
                }`}
              >
                Shopee
              </button>
              <button
                onClick={() => {
                  setSelectedPlatform("TIKTOK");
                  setSearchQuery("");
                }}
                className={`text-xs font-semibold py-1.5 px-4 rounded-full custom-transition ${
                  selectedPlatform === "TIKTOK"
                    ? "bg-dark-slate text-pure-white shadow-xs"
                    : "text-muted-sage hover:text-dark-slate"
                }`}
              >
                TikTok Shop
              </button>
              <button
                onClick={() => {
                  setSelectedPlatform("EBOOK");
                  setSearchQuery("");
                }}
                className={`text-xs font-semibold py-1.5 px-4 rounded-full custom-transition ${
                  selectedPlatform === "EBOOK"
                    ? "bg-dark-slate text-pure-white shadow-xs"
                    : "text-muted-sage hover:text-dark-slate"
                }`}
              >
                E-Book
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
