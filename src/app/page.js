"use client";

import { useState, useEffect } from "react";
import { MOCK_PRODUCTS, PROFILE_DATA } from "@/data/mockProducts";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function Home() {
  const [activePhase, setActivePhase] = useState("LINK_TREE"); // 'LINK_TREE' | 'CATALOG'
  const [selectedPlatform, setSelectedPlatform] = useState("SHOPEE"); // 'SHOPEE' | 'TIKTOK' | 'EBOOK'
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 8; // Shows pagination beautifully

  // Fetch products from Supabase
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Error fetching products from Supabase:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handler to navigate to Catalog
  const openCatalog = (platform) => {
    setSelectedPlatform(platform);
    setSearchQuery("");
    setCurrentPage(1);
    setActivePhase("CATALOG");
  };

  // Filter products based on platform and search query (matches code or title)
  const filteredProducts = products.filter((product) => {
    const matchesPlatform = product.platform === selectedPlatform;
    const matchesSearch =
      searchQuery.trim() === "" ||
      product.product_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesSearch && product.is_active;
  });

  // Pagination Logic
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f4f5] text-dark-slate font-rubik">
      {/* PHASE 1: Linktree View */}
      {activePhase === "LINK_TREE" && (
        <div className="flex-1 flex flex-col items-center justify-center py-16 px-4">
          <div className="w-full max-w-md bg-pure-white rounded-3xl shadow-xl p-8 border border-muted-sage/20 text-center flex flex-col items-center">
            
            {/* Welcome Tag */}
            <p className="text-xs uppercase tracking-widest text-muted-sage font-bold mb-8">
              Selamat Datang
            </p>

            {/* Profile Avatar */}
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-dusty-rose p-1 mb-5">
              <img
                src={PROFILE_DATA.avatar_url}
                alt={PROFILE_DATA.display_name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            {/* Profile Info */}
            <h1 className="text-2xl font-bold tracking-tight text-dark-slate mb-1">
              {PROFILE_DATA.display_name}
            </h1>
            <p className="text-sm text-muted-sage mb-8 font-medium">
              {PROFILE_DATA.tagline}
            </p>

            {/* Main Link Stack */}
            <div className="w-full space-y-4 mb-10">
              {/* Button 1: E-Book */}
              <a
                href="https://lynk.id/nabilahmuchsin"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 rounded-full bg-earthy-mauve hover:bg-dark-slate text-pure-white font-semibold shadow-md hover:shadow-lg transform active:scale-98 custom-transition"
              >
                Beli E-Book Nabila
              </a>

              {/* Button 2: Shopee */}
              <button
                onClick={() => openCatalog("SHOPEE")}
                className="w-full py-4 rounded-full bg-dark-slate hover:bg-earthy-mauve text-pure-white font-semibold shadow-md hover:shadow-lg transform active:scale-98 custom-transition cursor-pointer"
              >
                Lihat Produk Shopee
              </button>

              {/* Button 3: TikTok */}
              <button
                onClick={() => openCatalog("TIKTOK")}
                className="w-full py-4 rounded-full bg-dark-slate hover:bg-earthy-mauve text-pure-white font-semibold shadow-md hover:shadow-lg transform active:scale-98 custom-transition cursor-pointer"
              >
                Lihat Produk TikTok Shop
              </button>
            </div>

            {/* Linktree Footer */}
            <div className="w-full border-t border-muted-sage/10 pt-4 flex items-center justify-between text-[11px] text-muted-sage">
              <span>{PROFILE_DATA.display_name}</span>
              <span>Copyright © 2026</span>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 2: Catalog View (Full-Width Desktop) */}
      {activePhase === "CATALOG" && (
        <div className="flex-1 flex flex-col">
          {/* Header Block (Full-Width) */}
          <header className="bg-dark-slate text-pure-white py-12 px-6 text-center relative overflow-hidden">
            <div className="absolute top-4 left-4">
              <button
                onClick={() => setActivePhase("LINK_TREE")}
                className="flex items-center text-xs font-semibold text-pure-white/80 hover:text-dusty-rose custom-transition cursor-pointer select-none"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali
              </button>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold font-rubik tracking-tight mb-2">
              {PROFILE_DATA.display_name}
            </h1>
            <p className="text-sm text-dusty-rose font-medium tracking-wider mb-8">
              {PROFILE_DATA.tagline}
            </p>

            {/* Smart Search Bar */}
            <div className="max-w-md mx-auto relative px-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Ketik Nomor/Kode Produk..."
                className="w-full bg-pure-white border-0 rounded-full py-3.5 pl-12 pr-10 text-dark-slate text-sm font-roboto-mono shadow-md focus:outline-none focus:ring-2 focus:ring-earthy-mauve/40 custom-transition"
              />
              <span className="absolute inset-y-0 left-0 pl-7 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-muted-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="absolute inset-y-0 right-0 pr-7 flex items-center text-muted-sage hover:text-dark-slate cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </header>

          {/* Quick Platform Switcher Tabs */}
          <div className="bg-pure-white border-b border-muted-sage/10 py-3 flex justify-center space-x-2 md:space-x-4">
            {["SHOPEE", "TIKTOK"].map((plat) => (
              <button
                key={plat}
                onClick={() => {
                  setSelectedPlatform(plat);
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider custom-transition cursor-pointer ${
                  selectedPlatform === plat
                    ? "bg-earthy-mauve text-pure-white shadow-xs font-bold"
                    : "text-muted-sage hover:text-dark-slate hover:bg-neutral-50"
                }`}
              >
                {plat === "SHOPEE" ? "Shopee" : "TikTok Shop"}
              </button>
            ))}
          </div>

          {/* Catalog Body Content */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-10 md:py-14">
            
            {/* Selamat Datang Header inside grid view */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-muted-sage/15 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-dark-slate">Selamat Datang</h2>
                <p className="text-xs text-muted-sage mt-1 font-medium font-roboto-mono">
                  Menampilkan kategori {selectedPlatform} • {totalItems} item terdaftar
                </p>
              </div>
            </div>

            {/* Product Grid Area (4 columns on desktop, 2 columns on mobile) */}
            {paginatedProducts.length > 0 ? (
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  {paginatedProducts.map((product) => (
                    <a
                      key={product.id}
                      href={product.redirect_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-pure-white border border-muted-sage/20 rounded-2xl overflow-hidden hover:shadow-lg hover:border-earthy-mauve/30 transform hover:-translate-y-1 custom-transition flex flex-col"
                    >
                      {/* Image container aspect square */}
                      <div className="relative aspect-square bg-neutral-100 overflow-hidden w-full">
                        <img
                          src={product.image_url}
                          alt={product.title}
                          className="w-full h-full object-cover custom-transition group-hover:scale-105"
                          loading="lazy"
                        />
                        {/* Overlay Category badge */}
                        <div className="absolute top-3 left-3 bg-pure-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md text-[9px] font-extrabold text-earthy-mauve shadow-xs uppercase">
                          {product.platform === "EBOOK" ? "Book" : product.platform}
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-sm font-semibold font-rubik text-dark-slate leading-snug line-clamp-2 mb-2 group-hover:text-earthy-mauve custom-transition">
                            {product.title}
                          </h3>
                        </div>
                        <div className="pt-3 flex items-center justify-between border-t border-muted-sage/10 mt-2">
                          <span className="text-xs font-roboto-mono text-earthy-mauve font-bold">
                            Kode: {product.product_code}
                          </span>
                          <span className="text-xs font-semibold font-rubik text-muted-sage group-hover:text-dark-slate flex items-center">
                            Beli Sekarang
                            <svg className="w-3 h-3 ml-1 transform group-hover:translate-x-0.5 custom-transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-14 flex items-center justify-center space-x-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`w-9 h-9 rounded-lg border border-muted-sage/20 flex items-center justify-center custom-transition cursor-pointer ${
                        currentPage === 1
                          ? "text-muted-sage/40 cursor-not-allowed"
                          : "text-dark-slate hover:border-earthy-mauve hover:bg-earthy-mauve/5"
                      }`}
                    >
                      &lt;
                    </button>
                    
                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 rounded-lg border text-xs font-bold font-roboto-mono custom-transition cursor-pointer ${
                          currentPage === page
                            ? "bg-earthy-mauve border-earthy-mauve text-pure-white shadow-xs"
                            : "border-muted-sage/20 text-muted-sage hover:border-dark-slate hover:text-dark-slate"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    {/* Next Button */}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`w-9 h-9 rounded-lg border border-muted-sage/20 flex items-center justify-center custom-transition cursor-pointer ${
                        currentPage === totalPages
                          ? "text-muted-sage/40 cursor-not-allowed"
                          : "text-dark-slate hover:border-earthy-mauve hover:bg-earthy-mauve/5"
                      }`}
                    >
                      &gt;
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-pure-white rounded-2xl shadow-xs border border-muted-sage/10">
                <svg className="w-16 h-16 text-muted-sage/30 mb-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-bold text-dark-slate">Produk Tidak Ditemukan</h3>
                <p className="text-sm text-muted-sage mt-1 max-w-md px-4">
                  Tidak ada hasil pencarian untuk &ldquo;{searchQuery}&rdquo;. Silakan masukkan kode produk atau nama produk yang lain.
                </p>
              </div>
            )}
          </main>

          {/* Full-Width Footer Section */}
          <footer className="bg-dark-slate text-pure-white pt-12 pb-6 px-6 mt-16 border-t border-muted-sage/15">
            <div className="max-w-7xl w-full mx-auto mb-8 pb-8 border-b border-muted-sage/10">
              {/* Columns */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <h4 className="text-xs font-bold text-dusty-rose uppercase tracking-wider mb-3">Links</h4>
                  <ul className="space-y-2 text-sm text-muted-sage">
                    <li>
                      <button onClick={() => { setSelectedPlatform("SHOPEE"); setCurrentPage(1); }} className="hover:text-pure-white transition-colors cursor-pointer">Shopee</button>
                    </li>
                    <li>
                      <button onClick={() => { setSelectedPlatform("TIKTOK"); setCurrentPage(1); }} className="hover:text-pure-white transition-colors cursor-pointer">TikTok Shop</button>
                    </li>
                    <li>
                      <a href="https://lynk.id/nabilahmuchsin" target="_blank" rel="noopener noreferrer" className="hover:text-pure-white transition-colors cursor-pointer">Beli E-Book</a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-dusty-rose uppercase tracking-wider mb-3">Ikuti Kami</h4>
                  <ul className="space-y-2 text-sm text-muted-sage">
                    <li>
                      <a href="https://www.instagram.com/nabilahmuchsin/" target="_blank" rel="noopener noreferrer" className="hover:text-pure-white transition-colors">Instagram</a>
                    </li>
                    <li>
                      <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-pure-white transition-colors">TikTok</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-muted-sage gap-4">
              <span>Copyright © 2026 Nabila Muchsin. All rights reserved.</span>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}
