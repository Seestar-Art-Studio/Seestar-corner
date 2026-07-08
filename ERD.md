Entitas 1: Admin

id (UUID, Primary Key)

username (String, Unique)

password_hash (String)

created_at (DateTime)

Entitas 2: Profile (Pengaturan Landing Page)

id (Int, Primary Key)

display_name (String) — Misal: "Nabila Muchsin"

tagline (String) — Misal: "Where Modesty Meets Class."

avatar_url (String)

Entitas 3: Product (Katalog & Link)

id (UUID, Primary Key)

platform (Enum: 'SHOPEE', 'TIKTOK', 'EBOOK')

product_code (String) — Misal: A1111 (Unique gabungan bersama platform, e.g. UNIQUE(product_code, platform))

title (String)

image_url (String)

redirect_url (String) — Link affiliate/Lynk

is_active (Boolean, Default: true)

created_at (DateTime)