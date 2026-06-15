# Project: Nabila's Links & Catalog (Mobile-First, AI-Driven)

**Goal:** Build a responsive, two-phase micro-site (Linktree -> Product Catalog) with a clean, professional "Vibe Coding" aesthetic using Next.js and Tailwind CSS.

---

## 1. Design Tokens & Global Styles
* **Fonts:** Import 'Rubik' (headings, buttons) and 'Roboto Mono' (codes, inputs) from Google Fonts.
* **Color Palette:** Use Tailwind arbitrary values or a custom theme config.
    * `#424B54` (Dark Slate): Main dark bg, primary text.
    * `#93A8AC` (Muted Sage): Borders, secondary text, disabled states.
    * `#FFFFFF` (Pure White): Card backgrounds, high-contrast text.
    * `#E2B4BD` (Dusty Rose): Subtle accents, subtitles.
    * `#9B6A6C` (Earthy Mauve): Primary CTAs, active states.
* **Global Utilities:**
    * `custom-transition`: Smooth `all 0.3s` for hover states.
    * `glass-morphism`: (Optional) `backdrop-blur-sm` for elevated cards.
    * `pill-button`: `rounded-full`, centered text, `hover:bg-dark-slate`.

---

## 2. Core State Management (Next.js App Router)
Create a root client component (`src/app/layout.tsx` wrapper or `src/components/LandingPage.tsx`) that manages the application flow.
* **State:**
    * `activePhase`: `'LINK_TREE'` | `'CATALOG'`
    * `selectedPlatform`: `'SHOPEE'` | `'TIKTOK'` | `null`

---

## 3. Component Specification

### A. Phase 1: `LinkTreeView` (Default View)
* **Layout:** Mobile-first container (`max-w-md`), centered. Light background.
* **Header:**
    * Profile: Circular placeholder, "Nabila Muchsin" (Rubik, Bold), "Where Modesty Meets Class." (Rubik, `#93A8AC`).
* **Actions:** Vertical stack of wide, rounded buttons.
    * Button 1: "Beli E-Book Nabila" (External Link).
    * Button 2: "Lihat Produk Shopee" (OnClick: `setActivePhase('CATALOG')`, `setSelectedPlatform('SHOPEE')`).
    * Button 3: "Lihat Produk TikTok Shop" (OnClick: `setActivePhase('CATALOG')`, `setSelectedPlatform('TIKTOK')`).

### B. Phase 2: `CatalogGridView`
* **Top Bar:** "← Kembali ke Menu Utama" button (Returns to Phase 1).
* **Search Bar:** Input field with `rounded-full`, `Roboto Mono` placeholder (e.g., "Ketik Nomor/Kode Produk...").
* **Product Grid:**
    * Responsive: `grid-cols-2` (mobile), `md:grid-cols-3` (desktop).
    * **Card Style:** White background, `rounded-2xl`, border `#93A8AC`.
    * **Image:** Square aspect ratio (gray placeholder or user-provided URL).
    * **Text:** Product Title (Truncate 2 lines), "Kode: [CODE]" (`Roboto Mono`, `#9B6A6C`).
    * **Mock Data Logic:** Use `.filter()` to show only products matching `selectedPlatform` and Search Input (partial string match on `product_code`).

---

## 4. Admin Dashboard (UI Skeleton)
Create a route `src/app/admin/page.tsx` (or `src/components/AdminDashboard.tsx`).
* **Layout:** Two-column (Sidebar + Canvas).
* **Sidebar:** Dark Slate background, "Manage Products" menu item.
* **Form:** White canvas, rounded corners.
    * Fields: Platform (Radio: Shopee, TikTok, E-Book), Product Code (`Roboto Mono`), Product Name (`Rubik`), Link URL, Image Upload Area (dashed border).
    * Save Button (`#9B6A6C`, solid).

---

## 5. Mock Data (For AI Implementation)
Define an array `MOCK_PRODUCTS` with at least 6 objects containing `id`, `platform` (SHOPEE/TIKTOK), `product_code`, `title`, and `image_url`.
