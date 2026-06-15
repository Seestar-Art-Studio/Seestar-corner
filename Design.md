# Context: Frontend Vibe Coding Instructions
We are building the frontend for a responsive multi-step landing page using React and Tailwind CSS. The design has two main phases for regular users, and an isolated Admin dashboard. 

Read the layout structure, design tokens, and functional requirements below, and generate the necessary React components and layouts. For now, use mock data arrays to populate the UI.

## 1. Design Tokens & Global Styles
* **Typography:** Include Google Fonts in the layout.
    * Primary (Headings, Buttons, Names): `font-family: 'Rubik', sans-serif;`
    * Secondary (Search input, Product Codes): `font-family: 'Roboto Mono', monospace;`
* **Color Palette (Tailwind Custom Config / Arbitrary values):**
    * Dark Slate: `#424B54` (Main dark backgrounds, active button text)
    * Muted Sage: `#93A8AC` (Borders, secondary text, muted states)
    * Pure White: `#FFFFFF` (Card backgrounds, light text)
    * Dusty Rose: `#E2B4BD` (Subtitles, subtle accents)
    * Earthy Mauve: `#9B6A6C` (Primary CTA buttons, active state backgrounds)

## 2. Core Architecture & Routing (State Management)
Create a main wrapper component (`LandingPage.jsx/tsx`) that uses a `viewState` to toggle between Phase 1 and Phase 2 without hard page reloads.

* State: `activePhase` (values: `'LINK_TREE'` or `'CATALOG'`).
* State: `selectedPlatform` (values: `'SHOPEE'` or `'TIKTOK'`, to filter Phase 2 data).

---

## 3. View Components

### A. Phase 1 Component (`LinkTreeView`)
This is the default view. It looks like a premium Linktree.
* **Layout:** Max-width `md:max-w-md` (mobile-first container), centered on screen. Background is `#FFFFFF` or a very soft gray, but the top header block has a `#424B54` background.
* **Profile Section:** Circular avatar placeholder. Name "Nabila Muchsin" (Rubik, Bold, `#424B54` if on white, or `#FFFFFF` if on dark header). Subtitle: "Where Modesty Meets Class." (Rubik, `#93A8AC`).
* **Main Action Buttons (Vertical Stack):** * Wide, pill-shaped buttons (`rounded-full`), block-level.
    * Style: Solid white background, `#424B54` border, or solid `#9B6A6C`. Font: Rubik.
    * Button 1: "Beli E-Book Nabila" (Simulates redirect, external link).
    * Button 2: "Lihat Produk Shopee" (OnClick -> sets `activePhase` to `'CATALOG'` and `selectedPlatform` to `'SHOPEE'`).
    * Button 3: "Lihat Produk TikTok Shop" (OnClick -> sets `activePhase` to `'CATALOG'` and `selectedPlatform` to `'TIKTOK'`).

### B. Phase 2 Component (`CatalogGridView`)
* **Top Bar:** A "← Kembali ke Menu Utama" button to return to Phase 1. Style: minimal text, Rubik, `#424B54`.
* **Header:** Shows "Katalog Produk [Platform Name]".
* **Search Bar:**
    * Input field with `rounded-full` or `rounded-lg`. Border `1px solid #93A8AC`.
    * Placeholder: "Ketik Nomor/Kode Produk...". Font: `Roboto Mono`.
* **Product Grid:**
    * 2 columns on mobile (`grid-cols-2`), gap 4.
    * **Card Design:** Background `#FFFFFF`, border `#93A8AC`, `rounded-2xl` overflow hidden.
    * Image area: Top half, aspect square, gray placeholder for now.
    * Content area: padding 3.
        * Title: 1-2 lines truncate, Rubik, `#424B54`.
        * Code: E.g., "Kode: A1111", Roboto Mono, text-sm, `#9B6A6C`.
    * Use `.filter()` on the mock data array to only show items matching the `selectedPlatform` and the Search Input query (searching against the `product_code` field).

---

## 4. Admin Dashboard UI (Isolated View)
Create a separate page or component (`AdminDashboard`) representing a protected route.
* **Layout:** Two-column on desktop (Left Sidebar, Right Content area).
* **Sidebar:** `#424B54` background. White text. Menu: "Manage Products".
* **Product Form Canvas:** White background, `#93A8AC` border.
    * Form Fields stacked vertically:
        * Platform Select (Radio buttons for Shopee, TikTok, EBook). Active color `#9B6A6C`.
        * Product Code (Input, `Roboto Mono`).
        * Product Name (Input, `Rubik`).
        * Link URL (Input, `Roboto Mono`).
        * Image Upload Box (Dashed border `#93A8AC`, text "Click or Drag Image").
    * Save Button: Background `#9B6A6C`, hover `#424B54`, white text.

## 5. Mock Data Structure (To be implemented by AI)
Create a constant `const MOCK_PRODUCTS = [...]` containing at least 6 objects with fields: `id`, `platform` (SHOPEE/TIKTOK), `product_code` (e.g., A001), `title`, `image_url` (use placeholder URLs). Pass this data to the CatalogGrid component.

**Execution:** Please write the functional React components and compose them cleanly. Use Tailwind class names directly for styling according to the palette provided.