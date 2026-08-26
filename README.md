# 🌟 Seestar Corner — Link Aggregator & Product Catalog

[![Next.js](https://img.shields.io/badge/Next.js-16.2.9-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)

**Seestar Corner** (Kakila Web) adalah platform *micro-site* dan *link aggregator* modern yang dirancang khusus untuk mempermudah audiens media sosial menemukan produk afiliasi (**Shopee**, **TikTok Shop**) serta produk digital (**E-Book**). 

Website ini mengombinasikan kesederhanaan tampilan ala *Linktree* pada fase awal dengan kecanggihan **Katalog Produk Interaktif** yang dilengkapi pencarian kode produk instan, penyaringan kategori dinamis, serta **Admin Dashboard** mandiri untuk manajemen produk secara *real-time*.

---

## 📌 Daftar Isi
- [Tentang Website](#-tentang-website)
- [Tech Stack](#-tech-stack)
- [Fitur Utama](#-fitur-utama)
  - [1. User Landing Page (Multi-Step Navigation)](#1-user-landing-page-multi-step-navigation)
  - [2. Admin Management Dashboard](#2-admin-management-dashboard-admin)
- [Struktur Direktori](#-struktur-direktori)
- [Skema Database (Supabase)](#-skema-database-supabase)
- [Panduan Instalasi & Menjalankan](#-panduan-instalasi--menjalankan)
- [Akses Admin Dashboard](#-akses-admin-dashboard)

---

## 💡 Tentang Website

Platform ini dibangun untuk mengatasi keterbatasan *link in bio* konvensional dengan menghadirkan:
1. **Navigasi Multi-Fase Mulus:** Transisi instan dari tampilan profil sosial media (Linktree view) ke katalog produk tanpa perlu *reload* halaman.
2. **Pencarian Kode Produk Pintar (*Smart Search*):** Pengunjung media sosial yang melihat kode produk di konten video (misal: `S101`, `T201`) dapat langsung mengetik kode tersebut untuk menemukan dan membeli produk terkait dalam hitungan detik.
3. **Desain Mobile-First & Elegan:** Tampilan estetis bernuansa *Dark Slate*, *Dusty Rose*, dan *Earthy Mauve* dengan tipografi Google Fonts (*Rubik* & *Roboto Mono*) yang responsif di smartphone, tablet, maupun desktop.
4. **Admin Panel Lengkap dengan Live Smartphone Preview:** Memudahkan pengelola toko menginput, mengedit, menyematkan produk (*pin to top*), dan melihat hasil kartu secara langsung melalui simulasi layar HP sebelum disimpan.

---

## 🛠️ Tech Stack

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) | Server & Client Components, Dynamic Routing, Metadata SEO |
| **Frontend Library** | [React 19](https://react.dev/) | State management dengan React Hooks (`useState`, `useEffect`) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first CSS, custom design tokens, micro-transitions, glassmorphism |
| **Database & BaaS** | [Supabase](https://supabase.com/) | PostgreSQL backend untuk persistensi data produk |
| **Tipografi** | Google Fonts via `next/font` | `Rubik` (Headings & UI) dan `Roboto Mono` (Kode produk & input) |
| **Package Manager** | `npm` | Manajemen dependensi |
| **Linter & Code Quality** | ESLint 9 | Standardisasi kode JavaScript |

---

## ✨ Fitur Utama

### 1. User Landing Page (Multi-Step Navigation)

#### 🔹 Fase 1: Linktree / Bio Link View (Default)
- **Header Profil:** Foto profil melingkar dengan *border accent*, nama display *Seestar Corner*, dan deskripsi/tagline.
- **Daftar Tombol Akses Cepat:**
  - 📖 **E-Book:** Tautan langsung ke halaman eksternal (Lynk.id).
  - 🛒 **Lihat Produk Shopee:** Membuka katalog khusus produk Shopee Affiliate.
  - 🎵 **Lihat Produk TikTok Shop:** Membuka katalog khusus produk TikTok Shop.

#### 🔹 Fase 2: Interactive Product Catalog View
- **Header & Navigasi:** Tombol kembali ke menu utama serta tombol *switcher* instan antara platform Shopee dan TikTok Shop.
- **Smart Search Bar:** Pencarian instan *real-time* berdasarkan **kode produk** (misal: `A101`, `S202`) maupun **nama produk**.
- **Filter Kategori Dinamis:** Tombol filter horizontal (misal: *Gamis, Hijab, Tas, Rok, Tunik, Alat Masak*, dll.) lengkap dengan badge jumlah item otomatis.
- **Sematkan Produk (*Pin to Top*):** Produk yang ditandai *pinned* otomatis muncul di urutan paling atas dengan badge penanda khusus 📌.
- **Kartu Produk Interaktif:**
  - Gambar produk dengan efek *zoom hover* dan *lazy loading*.
  - Badge kategori & badge platform toko.
  - Tampilan kode produk yang jelas (*Roboto Mono*).
  - Tombol aksi langsung membuka tautan e-commerce asli di tab baru.
- **Skeleton Loading:** Tampilan animasi *skeleton placeholder* saat memuat data agar pengalaman pengguna terasa halus.
- **Sistem Paginasi:** Pembagian tampilan per 12 item dengan navigasi halaman yang rapi.

---

### 2. Admin Management Dashboard (`/admin`)

Halaman pengelola terisolasi untuk manajemen katalog produk tanpa perlu membuka database secara manual.

- **Proteksi Akses & Otorisasi:**
  - Dilindungi sistem kunci autentikasi (*secret key authentication*).
  - Pengunjung tanpa kunci akses valid akan dialihkan ke **halaman 404 (Not Found) palsu** demi keamanan.
- **CRUD Produk (Create, Read, Update, Delete):**
  - **Tambah Produk Baru:** Formulir lengkap (Platform, Kode Produk, Nama Produk, Kategori, Tautan Afiliasi, Gambar).
  - **Edit Data Produk:** Mode edit instan untuk mengubah detail produk.
  - **Hapus Produk:** Konfirmasi keamanan sebelum menghapus produk dari database.
- **Live Smartphone Mockup Preview:**
  - Simulasi layar smartphone interaktif di samping form yang memperlihatkan pratinjau tampilan kartu produk secara *real-time* saat admin mengetik atau mengunggah gambar.
- **Validasi Anti-Duplikasi:** Sistem otomatis menolak input jika kode produk sudah terdaftar pada platform yang sama.
- **Manajemen Kategori Fleksibel:** Bisa memilih kategori default yang sudah ada atau membuat kategori kustom baru langsung dari formulir.
- **Unggah Gambar Mudah:** Mendukung *upload* berkas gambar lokal dari galeri/perangkat (hingga 2MB) maupun input URL gambar langsung dari internet.
- **Pin / Unpin Cepat:** Tombol 1-klik di tabel inventaris untuk menyematkan atau membatalkan sematan produk ke posisi teratas.
- **Tabel Inventaris Terstruktur:**
  - Filter tabel berdasarkan platform (*Semua*, *Shopee*, *TikTok*).
  - Indikator live status produk dan tautan direct URL.
- **Offline / Mock Fallback:** Tetap dapat diuji coba secara lokal dengan *mock state* meskipun variabel koneksi Supabase belum diatur.

---

## 📂 Struktur Direktori

```text
seestar-corner/
├── public/                     # Aset statis publik (gambar, favicon, avatar)
│   ├── default_preview.jpg
│   ├── kakila_photo.jpg
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── page.js         # Halaman Admin Dashboard (CRUD, live preview, inventory)
│   │   ├── globals.css         # Tailwind v4 import, custom tokens, and animations
│   │   ├── layout.js           # Root layout, Google Fonts (Rubik & Roboto Mono), SEO
│   │   └── page.js             # Halaman Beranda / Landing Page (Linktree & Catalog View)
│   ├── data/
│   │   └── mockProducts.js     # Data profil default & mock fallback
│   └── lib/
│       └── supabase.js         # Inisialisasi Supabase Client & fallback checker
├── .env                        # Environment variables lokal
├── AGENTS.md                   # Instruksi agent & panduan Next.js
├── CLAUDE.md                   # Catatan spesifikasi & arsitektur proyek
├── Design.md                   # Panduan desain UI, warna, & tipografi
├── ERD.md                      # Skema entitas database
├── PRD.md                      # Product Requirement Document
├── package.json                # Dependensi & script Next.js
└── README.md                   # Dokumentasi utama proyek
```

---

## 🗄️ Skema Database (Supabase)

Jika Anda ingin menyiapkan tabel `products` di database Supabase baru, jalankan query SQL berikut di **Supabase SQL Editor**:

```sql
-- Membuat tabel produk
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform VARCHAR(20) NOT NULL CHECK (platform IN ('SHOPEE', 'TIKTOK', 'EBOOK')),
    product_code VARCHAR(50) NOT NULL,
    title TEXT NOT NULL,
    image_url TEXT,
    redirect_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_product_platform UNIQUE (product_code, platform)
);

-- Mengaktifkan Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Kebijakan: Semua pengunjung dapat melihat produk aktif
CREATE POLICY "Public Read Access"
ON public.products
FOR SELECT
USING (true);

-- Kebijakan: Akses penuh untuk service role / authenticated
CREATE POLICY "Full Admin Access"
ON public.products
FOR ALL
USING (true)
WITH CHECK (true);
```

---

## 🚀 Panduan Instalasi & Menjalankan

### 1. Prasyarat
Pastikan komputer Anda sudah terinstal:
- [Node.js](https://nodejs.org/) versi 18.18.0 atau lebih baru.
- Manajer paket `npm`, `yarn`, atau `pnpm`.

### 2. Kloning Repositori & Masuk Direktori
```bash
git clone https://github.com/Bikdannnn/Web_Kak-Ila.git
cd Web_Kak-Ila
```

### 3. Instal Dependensi
```bash
npm install
```

### 4. Konfigurasi Environment Variables
Buat berkas `.env` atau `.env.local` di direktori utama (root) proyek dan isi dengan kredensial Supabase Anda:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-or-publishable-key
```

### 5. Jalankan Server Development
```bash
npm run dev
```

Buka browser Anda dan kunjungi [http://localhost:3000](http://localhost:3000).

### 6. Build untuk Produksi
```bash
npm run build
npm run start
```

---

## 🔑 Akses Admin Dashboard

Untuk masuk ke halaman dashboard admin:

1. Kunjungi rute admin dengan menambahkan parameter kunci autentikasi di URL:
   ```text
   http://localhost:3000/admin?key=kakila2026
   ```
2. Kunci valid bawaan: `kakila2026` atau `nabila-muchsin`.
3. Setelah pertama kali berhasil login, sesi akan disimpan secara otomatis di `localStorage` browser Anda.

---

## 🎨 Palet Warna & Desain

- **Dark Slate (`#203337` / `#424B54`):** Warna latar header, teks utama, dan elemen tegas.
- **Earthy Mauve (`#9B6A6C`):** Warna utama tombol CTA, aksen aktif, dan kode produk.
- **Dusty Rose (`#E2B4BD`):** Warna aksen lembut dan subtitel.
- **Muted Sage (`#93A8AC`):** Warna border kartu, teks sekunder, dan status nonaktif.
- **Pure White (`#FFFFFF`):** Warna latar kartu produk dan formulir.

---

## 📄 Lisensi
Proyek ini dibuat untuk keperluan katalog dan landing page afiliasi **Seestar Corner**. Seluruh hak cipta dilindungi.
