"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PROFILE_DATA } from "@/data/mockProducts";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function AdminDashboard() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Form & Product List States
  const [products, setProducts] = useState([]);
  const [platform, setPlatform] = useState("SHOPEE"); // 'SHOPEE' | 'TIKTOK'
  const [productCode, setProductCode] = useState("");
  const [productName, setProductName] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  // Category States & Helpers
  const DEFAULT_CATEGORIES = ["Gamis", "Hijab", "Tas", "Rok", "Tunik", "Kemeja", "Alat Masak", "Bumbu Masak", "Lainnya"];
  const [category, setCategory] = useState("Gamis");
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  // Helper to parse category from title [Category] Clean Title
  const parseProductTitle = (fullTitle) => {
    const match = fullTitle.match(/^\[(.*?)\]\s*(.*)$/);
    if (match) {
      return {
        category: match[1].trim(),
        cleanTitle: match[2].trim()
      };
    }
    return {
      category: "Lainnya",
      cleanTitle: fullTitle
    };
  };

  // Derived custom categories based on loaded products
  const customCategories = Array.from(new Set(
    products
      .map(p => parseProductTitle(p.title).category)
      .filter(cat => !DEFAULT_CATEGORIES.includes(cat))
  ));

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran gambar terlalu besar! Maksimal 2MB.");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result);
      setIsUploading(false);
    };
    reader.onerror = () => {
      alert("Gagal membaca berkas gambar.");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleEdit = (product) => {
    const parsed = parseProductTitle(product.title);
    setEditingProduct(product);
    setPlatform(product.platform);
    setProductCode(product.product_code);
    setProductName(parsed.cleanTitle);
    setCategory(parsed.category);
    setNewCategoryInput("");
    setShowNewCategoryInput(false);
    setLinkUrl(product.redirect_url);
    setImageUrl(product.image_url === "/default_preview.jpg" ? "" : product.image_url);
    
    // Scroll smoothly to form section on top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Check custom secret link bypass on mount
  useEffect(() => {
    const validKeys = ["kakila2026", "nabila-muchsin"];
    const storedKey = localStorage.getItem("kakila_admin_key");
    const urlParams = new URLSearchParams(window.location.search);
    const urlKey = urlParams.get("key");

    let authenticated = false;
    if (urlKey && validKeys.includes(urlKey)) {
      localStorage.setItem("kakila_admin_key", urlKey);
      authenticated = true;
      // Remove query parameter from URL bar for clean appearance
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (storedKey && validKeys.includes(storedKey)) {
      authenticated = true;
    }
    
    // Defer state update to avoid synchronous setState inside useEffect warning
    setTimeout(() => {
      setIsAuthenticated(authenticated);
      setIsCheckingAuth(false);
    }, 0);
  }, []);

  // Fetch products from Supabase
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const fetchProducts = async () => {
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
        console.error("Error fetching products in Admin:", err);
      }
    };

    fetchProducts();
  }, []);

  // Save Product Handler
  const handleSave = async (e) => {
    e.preventDefault();
    if (!productCode || !productName || !linkUrl) {
      alert("Harap isi seluruh field formulir!");
      return;
    }
    setIsSubmitting(true);
    const imgUrl = imageUrl || "/default_preview.jpg";

    const finalCategory = showNewCategoryInput && newCategoryInput.trim() !== ""
      ? newCategoryInput.trim()
      : category;
    const formattedTitle = `[${finalCategory}] ${productName}`;

    if (isSupabaseConfigured) {
      try {
        if (editingProduct) {
          // UPDATE MODE
          const updatedProduct = {
            platform,
            product_code: productCode.toUpperCase(),
            title: formattedTitle,
            image_url: imgUrl,
            redirect_url: linkUrl,
            is_active: editingProduct.is_active
          };

          const { data, error } = await supabase
            .from("products")
            .update(updatedProduct)
            .eq("id", editingProduct.id)
            .select();

          if (error) throw error;

          if (data && data[0]) {
            setProducts(products.map((p) => (p.id === editingProduct.id ? data[0] : p)));
            setSuccessMessage("Produk berhasil diperbarui di database!");
            
            // Reset form
            setProductCode("");
            setProductName("");
            setLinkUrl("");
            setImageUrl("");
            setCategory("Gamis");
            setNewCategoryInput("");
            setShowNewCategoryInput(false);
            setEditingProduct(null);
          }
        } else {
          // INSERT MODE
          const newProduct = {
            platform,
            product_code: productCode.toUpperCase(),
            title: formattedTitle,
            image_url: imgUrl,
            redirect_url: linkUrl,
            is_active: true
          };

          const { data, error } = await supabase
            .from("products")
            .insert([newProduct])
            .select();

          if (error) throw error;

          if (data && data[0]) {
            setProducts([data[0], ...products]);
            setSuccessMessage("Produk berhasil disimpan ke database!");
            
            // Reset form
            setProductCode("");
            setProductName("");
            setLinkUrl("");
            setImageUrl("");
            setCategory("Gamis");
            setNewCategoryInput("");
            setShowNewCategoryInput(false);
          }
        }
      } catch (err) {
        console.error("Error saving product to Supabase:", err);
        alert(`Gagal menyimpan produk ke database: ${err.message || err}`);
      } finally {
        setIsSubmitting(false);
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } else {
      // Fallback local save for testing when Supabase env variables are missing
      setTimeout(() => {
        if (editingProduct) {
          // UPDATE MODE (MOCK)
          const updatedProduct = {
            ...editingProduct,
            platform,
            product_code: productCode.toUpperCase(),
            title: formattedTitle,
            image_url: imgUrl,
            redirect_url: linkUrl
          };

          setProducts(products.map((p) => (p.id === editingProduct.id ? updatedProduct : p)));
          setSuccessMessage("Produk berhasil diperbarui (Mock)!");
          
          setProductCode("");
          setProductName("");
          setLinkUrl("");
          setImageUrl("");
          setCategory("Gamis");
          setNewCategoryInput("");
          setShowNewCategoryInput(false);
          setEditingProduct(null);
        } else {
          // INSERT MODE (MOCK)
          const newProduct = {
            id: `prod-${Date.now()}`,
            platform,
            product_code: productCode.toUpperCase(),
            title: formattedTitle,
            image_url: imgUrl,
            redirect_url: linkUrl,
            is_active: true,
            created_at: new Date().toISOString()
          };

          setProducts([newProduct, ...products]);
          setSuccessMessage("Produk berhasil ditambahkan (Mock)!");
          
          setProductCode("");
          setProductName("");
          setLinkUrl("");
          setImageUrl("");
          setCategory("Gamis");
          setNewCategoryInput("");
          setShowNewCategoryInput(false);
        }
        setIsSubmitting(false);
        setTimeout(() => setSuccessMessage(""), 3000);
      }, 600);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini dari katalog?")) {
      return;
    }

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase
          .from("products")
          .delete()
          .eq("id", id);

        if (error) throw error;

        setProducts(products.filter((p) => p.id !== id));
      } catch (err) {
        console.error("Error deleting product from Supabase:", err);
        alert(`Gagal menghapus produk: ${err.message || err}`);
      }
    } else {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  // Clear Form Fields
  const handleCancel = () => {
    setProductCode("");
    setProductName("");
    setLinkUrl("");
    setImageUrl("");
    setCategory("Gamis");
    setNewCategoryInput("");
    setShowNewCategoryInput(false);
    setEditingProduct(null);
  };

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Scroll listener for mobile sticky header behavior
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
        setIsMenuOpen(false); // Close mobile menu on scroll
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Logout admin
  const handleLogout = () => {
    localStorage.removeItem("kakila_admin_key");
    setIsAuthenticated(false);
  };

  // 1. Loading screen
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-earthy-mauve border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-muted-sage font-medium">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  // 2. FAKE 404 NOT FOUND PAGE (If unauthorized)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-pure-white flex flex-col items-center justify-center font-sans antialiased text-black">
        <div className="flex items-center space-x-5">
          <h1 className="text-2xl font-semibold border-r border-black/30 pr-5 align-top inline-block">404</h1>
          <div className="inline-block align-middle">
            <h2 className="text-sm font-normal leading-7">This page could not be found.</h2>
          </div>
        </div>
        <Link 
          href="/" 
          className="mt-6 text-xs text-neutral-500 hover:text-black underline underline-offset-4 custom-transition"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  // 3. ACTUAL ADMIN DASHBOARD
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f0f4f5] text-dark-slate font-rubik">
      
      {/* A. Left Sidebar */}
      <aside className="w-full md:w-64 bg-dark-slate text-pure-white flex flex-col justify-between shrink-0 shadow-lg z-20 md:sticky md:top-0 md:h-screen sticky top-0 transition-all duration-300">
        <div>
          {/* Logo & Title & Hamburger */}
          <div className="p-4 md:p-6 border-b border-muted-sage/15 flex items-center justify-between">
            <h1 className="font-bold text-base leading-tight tracking-wide">Admin Dashboard</h1>
            
            {/* Hamburger Button (Mobile Only) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-muted-sage hover:text-pure-white transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Navigation Menu */}
          <nav className={`${isMenuOpen ? "block" : "hidden"} md:block absolute md:static top-full left-0 right-0 bg-dark-slate md:bg-transparent shadow-xl md:shadow-none p-4 space-y-2 z-30 border-b border-muted-sage/15 md:border-b-0`}>
            <a
              href="#inventory"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-earthy-mauve text-pure-white font-semibold transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Inventory List</span>
            </a>
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-muted-sage hover:bg-white/5 hover:text-pure-white font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Lihat Landing Page</span>
            </Link>
            <button
              onClick={handleLogout}
              className="md:hidden flex w-full items-center space-x-3 px-4 py-3 rounded-xl text-muted-sage hover:bg-white/5 hover:text-pure-white font-medium transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Keluar</span>
            </button>
          </nav>
        </div>

        {/* User Info & Logout (Desktop Only) */}
        <div className="p-4 border-t border-muted-sage/15 bg-black/10 hidden md:flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-earthy-mauve/25 overflow-hidden">
              <img
                src={PROFILE_DATA.avatar_url}
                alt={PROFILE_DATA.display_name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">{PROFILE_DATA.display_name}</p>
              <p className="text-[9px] text-muted-sage uppercase font-bold tracking-wider">Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Keluar"
            className="p-1.5 rounded-lg text-muted-sage hover:text-red-400 hover:bg-white/5 custom-transition cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </aside>

      {/* B. Main Area */}
      <main className="flex-1 p-6 md:p-10 flex flex-col pb-24">
        
        {/* Top Header */}
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-dark-slate">
              {editingProduct ? `Edit Produk: ${editingProduct.title}` : "Tambah Produk Baru"}
            </h2>
            <p className="text-xs text-muted-sage mt-0.5">Kelola data item yang akan ditampilkan ke katalog Landing Page.</p>
          </div>
          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center shadow-xs animate-fade-in">
              <svg className="w-4 h-4 mr-1.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              {successMessage}
            </div>
          )}
        </header>

        {/* Layout Grid (Form & Live Preview) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          
          {/* 1. Left: Product Form (Column Span: 7) */}
          <div className="lg:col-span-7 bg-pure-white border border-muted-sage/20 rounded-2xl p-6 shadow-xs">
            <form onSubmit={handleSave} className="space-y-5">
              
              {/* Platform Select */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-sage mb-2.5">
                  Pilih Platform Toko
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "SHOPEE", label: "Shopee" },
                    { key: "TIKTOK", label: "TikTok Shop" }
                  ].map((p) => (
                    <label
                      key={p.key}
                      className={`flex items-center justify-center py-3 rounded-xl border text-xs font-bold cursor-pointer select-none custom-transition ${
                        platform === p.key
                          ? "border-earthy-mauve bg-earthy-mauve text-pure-white font-extrabold shadow-xs"
                          : "border-muted-sage/25 hover:border-dark-slate text-muted-sage"
                      }`}
                    >
                      <input
                        type="radio"
                        name="platform"
                        value={p.key}
                        checked={platform === p.key}
                        onChange={() => setPlatform(p.key)}
                        className="sr-only"
                      />
                      <span>{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Product Code */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-sage mb-1.5">
                  Kode Produk (Unique)
                </label>
                <input
                  type="text"
                  required
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value)}
                  placeholder="Contoh: S101, T201"
                  className="w-full bg-[#fbfcfc] border border-muted-sage/35 rounded-xl px-4 py-2.5 text-xs font-roboto-mono placeholder-muted-sage/60 focus:outline-none focus:ring-2 focus:ring-earthy-mauve/20 focus:border-earthy-mauve"
                />
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-sage mb-1.5">
                  Nama Produk
                </label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Contoh: Abaya Silk Premium - Elegant"
                  className="w-full bg-[#fbfcfc] border border-muted-sage/35 rounded-xl px-4 py-2.5 text-xs font-rubik placeholder-muted-sage/60 focus:outline-none focus:ring-2 focus:ring-earthy-mauve/20 focus:border-earthy-mauve"
                />
              </div>

              {/* Product Category */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-sage mb-1.5 flex justify-between items-center">
                  <span>Kategori Produk</span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewCategoryInput(!showNewCategoryInput);
                      setNewCategoryInput("");
                    }}
                    className="text-[10px] font-extrabold text-earthy-mauve hover:text-dark-slate transition-colors cursor-pointer"
                  >
                    {showNewCategoryInput ? "✕ Pilih dari List" : "+ Kategori Baru"}
                  </button>
                </label>

                {showNewCategoryInput ? (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      required
                      value={newCategoryInput}
                      onChange={(e) => setNewCategoryInput(e.target.value)}
                      placeholder="Masukkan nama kategori baru (contoh: Alat Masak)"
                      className="w-full bg-[#fbfcfc] border border-muted-sage/35 rounded-xl px-4 py-2.5 text-xs font-rubik placeholder-muted-sage/60 focus:outline-none focus:ring-2 focus:ring-earthy-mauve/20 focus:border-earthy-mauve"
                    />
                  </div>
                ) : (
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#fbfcfc] border border-muted-sage/35 rounded-xl px-4 py-2.5 text-xs font-rubik text-dark-slate focus:outline-none focus:ring-2 focus:ring-earthy-mauve/20 focus:border-earthy-mauve"
                  >
                    {Array.from(new Set([...DEFAULT_CATEGORIES, ...customCategories])).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Redirect URL */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-sage mb-1.5">
                  Tautan Produk / Tautan Afiliasi
                </label>
                <input
                  type="url"
                  required
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://shopee.co.id/... atau https://lynk.id/..."
                  className="w-full bg-[#fbfcfc] border border-muted-sage/35 rounded-xl px-4 py-2.5 text-xs font-roboto-mono placeholder-muted-sage/60 focus:outline-none focus:ring-2 focus:ring-earthy-mauve/20 focus:border-earthy-mauve"
                />
              </div>

              {/* Image URL Input */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-sage mb-1.5">
                  URL Gambar Produk (Mock Link)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Masukkan URL foto dari internet (Contoh: Unsplash)"
                  className="w-full bg-[#fbfcfc] border border-muted-sage/35 rounded-xl px-4 py-2.5 text-xs font-roboto-mono placeholder-muted-sage/60 focus:outline-none focus:ring-2 focus:ring-earthy-mauve/20 focus:border-earthy-mauve"
                />
              </div>

              {/* Drag & Drop Visual Box */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-sage mb-1.5">
                  Unggah Gambar Produk
                </label>
                <label 
                  htmlFor="product-image-upload"
                  className="border-2 border-dashed border-muted-sage/35 hover:border-earthy-mauve/50 rounded-xl p-5 text-center bg-[#fbfcfc] cursor-pointer custom-transition flex flex-col items-center block"
                >
                  <input
                    id="product-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <svg className="w-7 h-7 text-muted-sage mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-xs font-bold text-dark-slate">
                    {isUploading ? "Membaca gambar..." : "Klik untuk pilih foto dari galeri"}
                  </p>
                  <p className="text-[10px] text-muted-sage mt-0.5">
                    {imageUrl && imageUrl.startsWith("data:") ? "✓ Gambar galeri berhasil dimuat" : "Mendukung format PNG atau JPG hingga 2MB"}
                  </p>
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex space-x-3 pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider text-pure-white custom-transition cursor-pointer ${
                    isSubmitting ? "bg-muted-sage cursor-not-allowed" : "bg-earthy-mauve hover:bg-dark-slate shadow-md"
                  }`}
                >
                  {isSubmitting
                    ? "Menyimpan..."
                    : editingProduct
                    ? "Perbarui Produk"
                    : "Simpan Produk"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3.5 rounded-xl border border-muted-sage/30 hover:border-dark-slate text-xs font-bold uppercase tracking-wider text-muted-sage hover:text-dark-slate custom-transition cursor-pointer"
                >
                  Batal
                </button>
              </div>

            </form>
          </div>

          {/* 2. Right: Smartphone Mockup Live Preview (Column Span: 5) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-start">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-sage mb-3 self-start pl-1">
              Live Preview
            </h3>
            
            {/* Outer phone frame */}
            <div className="w-[280px] h-[520px] rounded-[40px] border-[12px] border-dark-slate bg-neutral-900 shadow-2xl relative flex flex-col p-3.5 overflow-hidden">
              
              {/* Phone speaker notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-28 h-5 bg-dark-slate rounded-b-2xl z-20 flex items-center justify-center">
                <div className="w-10 h-1 bg-neutral-700 rounded-full mb-1"></div>
              </div>

              {/* Phone Screen Container */}
              <div className="flex-1 bg-[#f0f4f5] rounded-[24px] overflow-hidden flex flex-col p-3 relative z-10 pt-6">
                
                {/* Simulated header inside mockup */}
                <div className="text-center mb-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-dusty-rose p-0.5 mx-auto mb-1">
                    <img
                      src={PROFILE_DATA.avatar_url}
                      alt={PROFILE_DATA.display_name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <h4 className="text-[9px] font-extrabold text-dark-slate">{PROFILE_DATA.display_name}</h4>
                  <p className="text-[7px] text-muted-sage">Katalog {platform}</p>
                </div>

                {/* Simulated Product Card Card Preview */}
                <div className="bg-pure-white border border-muted-sage/15 rounded-xl overflow-hidden shadow-xs flex flex-col flex-1 max-h-[300px]">
                  {/* Photo area inside preview */}
                  <div className="relative aspect-square w-full bg-neutral-100 flex-1 overflow-hidden">
                    <img
                      src={imageUrl || "/default_preview.jpg"}
                      alt="Product Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-pure-white/95 px-1.5 py-0.5 rounded-sm text-[7px] font-extrabold text-earthy-mauve uppercase">
                      {platform}
                    </div>
                  </div>

                  {/* Description area inside preview */}
                  <div className="p-2.5 flex flex-col justify-between shrink-0">
                    <div>
                      <span className="text-[7px] uppercase tracking-wider text-muted-sage font-extrabold block mb-0.5">
                        {showNewCategoryInput && newCategoryInput.trim() !== "" ? newCategoryInput.trim() : category}
                      </span>
                      <h5 className="text-[9px] font-bold text-dark-slate leading-tight line-clamp-2 mb-1.5">
                        {productName || "Nama Produk Preview"}
                      </h5>
                    </div>
                    <div className="pt-2 border-t border-muted-sage/10 flex items-center justify-between">
                      <span className="text-[8px] font-roboto-mono font-bold text-earthy-mauve">
                        Kode: {productCode.toUpperCase() || "S000"}
                      </span>
                      <span className="text-[8px] font-bold text-muted-sage flex items-center">
                        Beli
                        <svg className="w-2 h-2 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>

                </div>

                {/* Simulated Home indicator slot */}
                <div className="w-20 h-1 bg-neutral-400 rounded-full mx-auto mt-4 shrink-0"></div>

              </div>
            </div>
          </div>

        </div>

        {/* Celah warna putih dekoratif sebelum katalog terdaftar */}
        <div className="w-full h-8 bg-pure-white rounded-2xl mb-8 shadow-xs border border-muted-sage/10 flex items-center px-6">
          <div className="flex items-center space-x-2 text-[10px] font-bold text-earthy-mauve uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-earthy-mauve animate-pulse"></span>
            <span>Daftar Katalog Produk</span>
          </div>
        </div>

        {/* 3. Bottom Row: Registered Products List */}
        <section className="bg-pure-white border border-muted-sage/20 rounded-2xl shadow-xs overflow-hidden">
          <div className="px-6 py-5 border-b border-muted-sage/10 flex items-center justify-between">
            <h3 className="text-base font-bold text-dark-slate">Katalog Produk Terdaftar ({products.length})</h3>
            <span className="bg-neutral-100 text-dark-slate text-xs font-bold px-3 py-1 rounded-full">
              Live Data
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50/50 border-b border-muted-sage/10 text-[10px] font-bold text-muted-sage uppercase tracking-wider">
                  <th className="py-4 px-6">Produk</th>
                  <th className="py-4 px-6">Kategori</th>
                  <th className="py-4 px-6">Platform</th>
                  <th className="py-4 px-6">Kode Produk</th>
                  <th className="py-4 px-6">URL Tautan</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted-sage/5">
                {products.map((p) => {
                  const { category: parsedCat, cleanTitle } = parseProductTitle(p.title);
                  return (
                    <tr key={p.id} className="hover:bg-neutral-50/30 custom-transition text-xs">
                      {/* Title and Thumbnail */}
                      <td className="py-3 px-6 flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-lg bg-neutral-100 overflow-hidden shrink-0 border border-muted-sage/10">
                          <img src={p.image_url} alt={cleanTitle} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-semibold text-dark-slate line-clamp-1 max-w-[200px]">{cleanTitle}</span>
                      </td>
                      
                      {/* Category Badge */}
                      <td className="py-3 px-6">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-muted-sage/10 text-muted-sage border border-muted-sage/25">
                          {parsedCat}
                        </span>
                      </td>

                      {/* Platform Badge */}
                      <td className="py-3 px-6">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase ${
                            p.platform === "SHOPEE"
                              ? "bg-orange-50 text-orange-700 border border-orange-100"
                              : p.platform === "TIKTOK"
                              ? "bg-zinc-100 text-zinc-900 border border-zinc-200"
                              : "bg-purple-50 text-purple-700 border border-purple-100"
                          }`}
                        >
                          {p.platform === "EBOOK" ? "E-Book" : p.platform}
                        </span>
                      </td>

                      {/* Code */}
                      <td className="py-3 px-6 font-roboto-mono font-bold text-earthy-mauve">
                        {p.product_code}
                      </td>

                      {/* Redirect URL link */}
                      <td className="py-3 px-6 font-roboto-mono text-muted-sage max-w-[200px] truncate">
                        <a
                          href={p.redirect_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline hover:text-earthy-mauve"
                        >
                          {p.redirect_url}
                        </a>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-6 text-right space-x-3">
                        <button
                          onClick={() => handleEdit(p)}
                          className="font-bold text-earthy-mauve hover:text-dark-slate hover:underline custom-transition cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="font-bold text-red-500 hover:text-red-700 hover:underline custom-transition cursor-pointer"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

      </main>
    </div>
  );
}
