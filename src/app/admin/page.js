"use client";

import { useState } from "react";
import { MOCK_PRODUCTS } from "@/data/mockProducts";

export default function AdminDashboard() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [platform, setPlatform] = useState("SHOPEE"); // 'SHOPEE' | 'TIKTOK' | 'EBOOK'
  const [productCode, setProductCode] = useState("");
  const [productName, setProductName] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Simple validation & submission simulation
  const handleSave = (e) => {
    e.preventDefault();
    if (!productCode || !productName || !linkUrl) {
      alert("Harap isi seluruh field formulir!");
      return;
    }

    setIsSubmitting(true);

    // Simulate network delay
    setTimeout(() => {
      const newProduct = {
        id: `prod-${Date.now()}`,
        platform,
        product_code: productCode.toUpperCase(),
        title: productName,
        image_url: imageUrl || "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600", // fallback default mock image
        redirect_url: linkUrl,
        is_active: true,
        created_at: new Date().toISOString()
      };

      setProducts([newProduct, ...products]);
      setSuccessMessage("Produk berhasil ditambahkan ke katalog!");
      
      // Reset form fields
      setProductCode("");
      setProductName("");
      setLinkUrl("");
      setImageUrl("");
      setIsSubmitting(false);

      // Clear success notification
      setTimeout(() => {
        setSuccessMessage("");
      }, 4000);
    }, 800);
  };

  // Delete product simulation
  const handleDelete = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus produk ini dari katalog?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f6f8f8] text-dark-slate font-rubik">
      {/* 1. Left Sidebar */}
      <aside className="w-full md:w-64 bg-dark-slate text-pure-white flex flex-col justify-between shrink-0 shadow-lg">
        <div>
          {/* Logo & Title */}
          <div className="p-6 border-b border-muted-sage/20 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-earthy-mauve flex items-center justify-center font-bold text-lg text-pure-white">
              K
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Kakila Admin</h1>
              <p className="text-xs text-dusty-rose">Manage Catalog & Links</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <a
              href="#manage"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-earthy-mauve text-pure-white font-semibold transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
              <span>Manage Products</span>
            </a>
            <a
              href="/"
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-muted-sage hover:bg-white/5 hover:text-pure-white font-medium transition-colors"
            >
              <svg
                className="w-5 h-5"
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
              <span>View Landing Page</span>
            </a>
          </nav>
        </div>

        {/* User profile section at the bottom */}
        <div className="p-4 border-t border-muted-sage/20 flex items-center space-x-3 bg-black/10">
          <div className="w-10 h-10 rounded-full bg-earthy-mauve/30 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"
              alt="Admin"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-semibold">Nabila Muchsin</p>
            <p className="text-[10px] text-muted-sage">Administrator</p>
          </div>
        </div>
      </aside>

      {/* 2. Right Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen">
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold font-rubik text-dark-slate">Product Management</h2>
            <p className="text-sm text-muted-sage">Kelola tautan produk Shopee, TikTok Shop, dan E-Book Anda.</p>
          </div>
          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl text-sm flex items-center font-medium animate-fade-in shadow-xs">
              <svg className="w-4 h-4 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              {successMessage}
            </div>
          )}
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Column 1 & 2: Product Form */}
          <div className="xl:col-span-1">
            <div className="bg-pure-white border border-muted-sage/30 rounded-2xl p-6 shadow-xs">
              <h3 className="text-lg font-bold text-dark-slate mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-earthy-mauve" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Tambah Produk Baru
              </h3>
              
              <form onSubmit={handleSave} className="space-y-5">
                {/* Platform select options */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-sage mb-2">
                    Pilih Platform
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["SHOPEE", "TIKTOK", "EBOOK"].map((p) => (
                      <label
                        key={p}
                        className={`flex flex-col items-center justify-center py-2.5 rounded-xl border text-xs font-semibold cursor-pointer select-none custom-transition ${
                          platform === p
                            ? "border-earthy-mauve bg-earthy-mauve/5 text-earthy-mauve shadow-xs font-bold"
                            : "border-muted-sage/30 hover:border-dark-slate text-muted-sage"
                        }`}
                      >
                        <input
                          type="radio"
                          name="platform"
                          value={p}
                          checked={platform === p}
                          onChange={() => setPlatform(p)}
                          className="sr-only"
                        />
                        <span>{p === "EBOOK" ? "E-Book" : p}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Product Code */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-sage mb-1.5">
                    Kode Produk
                  </label>
                  <input
                    type="text"
                    required
                    value={productCode}
                    onChange={(e) => setProductCode(e.target.value)}
                    placeholder="Contoh: S101, T201, E301"
                    className="w-full bg-[#fbfcfc] border border-muted-sage/40 rounded-xl px-4 py-2.5 text-sm font-roboto-mono placeholder-muted-sage focus:outline-none focus:ring-2 focus:ring-earthy-mauve/20 focus:border-earthy-mauve"
                  />
                </div>

                {/* Product Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-sage mb-1.5">
                    Nama Produk
                  </label>
                  <input
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Masukkan nama deskriptif produk"
                    className="w-full bg-[#fbfcfc] border border-muted-sage/40 rounded-xl px-4 py-2.5 text-sm font-rubik placeholder-muted-sage focus:outline-none focus:ring-2 focus:ring-earthy-mauve/20 focus:border-earthy-mauve"
                  />
                </div>

                {/* Redirect Link */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-sage mb-1.5">
                    Tautan Redirect (Affiliate Link)
                  </label>
                  <input
                    type="url"
                    required
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://shopee.co.id/... atau https://lynk.id/..."
                    className="w-full bg-[#fbfcfc] border border-muted-sage/40 rounded-xl px-4 py-2.5 text-sm font-roboto-mono placeholder-muted-sage focus:outline-none focus:ring-2 focus:ring-earthy-mauve/20 focus:border-earthy-mauve"
                  />
                </div>

                {/* Mock Image URL */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-sage mb-1.5">
                    URL Gambar Produk (Mock)
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Masukkan URL Gambar (Kosongkan untuk default)"
                    className="w-full bg-[#fbfcfc] border border-muted-sage/40 rounded-xl px-4 py-2.5 text-sm font-roboto-mono placeholder-muted-sage focus:outline-none focus:ring-2 focus:ring-earthy-mauve/20 focus:border-earthy-mauve"
                  />
                </div>

                {/* Image Upload Box Placeholder */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-sage mb-1.5">
                    Unggah Gambar (Visual Model)
                  </label>
                  <div className="border-2 border-dashed border-muted-sage/40 hover:border-earthy-mauve/60 rounded-xl p-6 text-center cursor-pointer custom-transition bg-[#fbfcfc]">
                    <svg className="w-8 h-8 text-muted-sage mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs font-semibold text-dark-slate">Click or Drag Image</p>
                    <p className="text-[10px] text-muted-sage mt-0.5">PNG, JPG up to 2MB</p>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 rounded-xl font-bold text-center text-pure-white transition-colors cursor-pointer select-none ${
                    isSubmitting ? "bg-muted-sage cursor-not-allowed" : "bg-earthy-mauve hover:bg-dark-slate shadow-md"
                  }`}
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan ke Katalog"}
                </button>
              </form>
            </div>
          </div>

          {/* Column 3: Product List table visualization */}
          <div className="xl:col-span-2">
            <div className="bg-pure-white border border-muted-sage/30 rounded-2xl shadow-xs overflow-hidden">
              <div className="px-6 py-5 border-b border-muted-sage/10 flex items-center justify-between">
                <h3 className="text-lg font-bold text-dark-slate">Katalog Terdaftar</h3>
                <span className="bg-neutral-100 text-dark-slate text-xs font-bold px-2.5 py-1 rounded-full">
                  {products.length} Item
                </span>
              </div>

              {/* Table wrapper */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-50/50 border-b border-muted-sage/10 text-xs font-bold text-muted-sage uppercase tracking-wider">
                      <th className="py-4 px-6">Produk</th>
                      <th className="py-4 px-6">Platform</th>
                      <th className="py-4 px-6">Kode</th>
                      <th className="py-4 px-6">Redirect URL</th>
                      <th className="py-4 px-6 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-muted-sage/5">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-neutral-50/30 custom-transition">
                        {/* Title & Image thumbnail */}
                        <td className="py-4 px-6 flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-neutral-100 overflow-hidden shrink-0">
                            <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                          </div>
                          <span className="font-semibold text-sm line-clamp-1 max-w-[200px]">{p.title}</span>
                        </td>
                        {/* Platform with label badge */}
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              p.platform === "SHOPEE"
                                ? "bg-orange-50 text-orange-700"
                                : p.platform === "TIKTOK"
                                ? "bg-zinc-100 text-zinc-900"
                                : "bg-purple-50 text-purple-700"
                            }`}
                          >
                            {p.platform}
                          </span>
                        </td>
                        {/* Code */}
                        <td className="py-4 px-6 text-sm font-roboto-mono font-bold text-dark-slate">
                          {p.product_code}
                        </td>
                        {/* Redirect url */}
                        <td className="py-4 px-6 text-xs font-roboto-mono text-muted-sage max-w-[150px] truncate">
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
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="text-xs font-bold text-red-600 hover:text-red-800 hover:underline custom-transition cursor-pointer select-none"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
