# PRD — Aresphi Property

## Project Overview
Website untuk Aresphi Property, broker properti yang menyediakan layanan jual-beli, sewa, konsultasi, pemasaran, dan pendampingan transaksi properti. Website berfungsi sebagai etalase bisnis, generator lead, dan katalog layanan. **Primary goal: Lead generation** `[confirmed]`.

---

## Actors

| Actor | Description |
|-------|-------------|
| Pemilik Properti | Ingin menjual/menyewakan properti dengan cepat dan harga kompetitif |
| Pembeli Rumah | Mencari hunian sesuai kebutuhan dan anggaran |
| Investor Properti | Mencari properti dengan potensi keuntungan dan pertumbuhan nilai |
| Penyewa Individu/Keluarga | Mencari hunian aman, nyaman, strategis |
| Pelaku Usaha/Perusahaan | Mencari ruko, gudang, kantor, ruang usaha |
| Admin/Owner | Mengelola listing, memproses inquiry, mengupdate konten `[confirmed]` |

---

## Design Direction `[stated]`

**Design References:** `docs/design-inpirations/design-1.html` to `design-4.html`

### Design Principles

| Principle | Application |
|-----------|-------------|
| Elegant & Professional | Broker properti premium, bukan marketplace murah |
| Warm & Trustworthy | Warna hangat untuk membangun kepercayaan |
| Clean Typography | Serif untuk heading, sans-serif untuk body |
| Subtle Animations | Hover effects, scroll animations (tidak berlebihan) |
| Mobile-first | Responsive dengan prioritas mobile experience |

### Recommended Design Elements

**Typography:**
- Headings: Playfair Display atau Newsreader (serif, elegant)
- Body: Geist, Plus Jakarta Sans, atau Manrope (sans-serif, clean)
- Font pairing untuk kontras visual

**Color Palette:**
- Primary: Orange (brand color dari client) - gunakan sebagai accent
- Base: Warm neutrals (stone, beige, cream tones)
- Dark: Deep stone/charcoal untuk contrast sections
- Accent: Soft green or gold untuk secondary highlights

**Layout Patterns:**
- Split hero sections (text left, image right)
- Card-based property listings dengan hover effects
- Bento grid untuk featured properties
- Floating cards/components untuk visual interest
- Dark sections untuk contrast dan emphasis

**Component Patterns:**
- Property cards dengan flashlight/glow effect on hover
- Floating WhatsApp CTA button
- Stats/kredibilitas section dengan animated counters
- Testimonial slider/carousel
- Pricing/membership-style cards untuk layanan
- Newsletter subscription section

### Design Inspirations Summary

| Design File | Style | Applicable Elements |
|-------------|-------|---------------------|
| design-1.html (Aura) | Luxury furniture, warm elegance | Typography pairing, flashlight card effect, hero layout, trusted logos |
| design-2.html (ArchDigest) | Architecture portfolio, dark/light contrast | Split hero, grid/list toggle, carousel, awards section |
| design-3.html (Serene) | Wellness, natural tones | Bento grid, testimonial slider, accordion, parallax hero |
| design-4.html (Museum) | Cultural, exhibition | Floating ticket cards, folder tabs, newsletter, pricing tiers |

---

## Modules

### M1: Company Profile
**Status:** planned  
**Priority:** P1

Landing page yang memperkenalkan Aresphi Property, nilai-nilai usaha, dan keunggulan kompetitif.

**Features:**
- F1.1 Hero section dengan value proposition `[stated]`
- F1.2 Tentang kami (sejarah, visi, misi) `[stated]`
- F1.3 Nilai-nilai/usps (Transparansi, Pelayanan Personal, Kecepatan, Strategi Marketing, Integritas) `[stated]`
- F1.4 Statistik/kredibilitas (jumlah transaksi, klien, tahun pengalaman) `[inferred]`
- F1.5 Testimonial klien `[inferred]`
- F1.6 Team/agen profile `[inferred]`

### M2: Katalog Properti
**Status:** planned  
**Priority:** P1

Listing properti yang tersedia untuk dijual atau disewa. Skala < 100 listing `[confirmed]`.

**Features:**
- F2.1 Daftar listing properti (jual/sewa) `[stated]`
- F2.2 Filter dan pencarian (tipe, lokasi, harga, tipe properti) `[confirmed]`
- F2.3 Detail properti (foto, deskripsi, harga, lokasi, spesifikasi) `[confirmed]`
- F2.4 Kategori properti: rumah, apartemen, gudang, kantor, ruko, tanah `[stated]`
- F2.5 Gallery/foto properti `[confirmed]`
- F2.6 CTA inquiry/kontak untuk properti `[confirmed]`

### M3: Layanan
**Status:** planned  
**Priority:** P1

Halaman yang menjelaskan layanan yang ditawarkan.

**Features:**
- F3.1 Jual beli properti `[stated]`
- F3.2 Sewa properti (hunian & komersial) `[stated]`
- F3.3 Konsultasi properti `[stated]`
- F3.4 Pemasaran properti `[stated]`
- F3.5 Pendampingan transaksi `[stated]`

### M4: Lead Generation
**Status:** planned  
**Priority:** P1 (Primary Goal) `[confirmed]`

Mekanisme untuk menangkap calon customer. Direct WhatsApp dengan pre-filled message `[confirmed]`.

**Features:**
- F4.1 CTA WhatsApp dengan pre-filled message di setiap page `[confirmed]`
- F4.2 Form penjual/pemilik properti (submit listing) → WhatsApp `[confirmed]`
- F4.3 Floating WhatsApp button `[inferred]`

### M5: Kontak
**Status:** planned  
**Priority:** P1

Informasi kontak dan lokasi kantor.

**Features:**
- F5.1 Alamat kantor (placeholder untuk sekarang) `[confirmed]`
- F5.2 Nomor telepon/WhatsApp (placeholder) `[confirmed]`
- F5.3 Email (placeholder) `[confirmed]`
- F5.4 Google Maps embed `[inferred]`
- F5.5 Social media links `[inferred]`

### M6: Blog/Artikel Properti
**Status:** planned  
**Priority:** P2

Konten edukatif untuk menarik traffic dan membangun autoritas.

**Features:**
- F6.1 Daftar artikel `[inferred]`
- F6.2 Kategori artikel (tips properti, market update, panduan investasi) `[inferred]`
- F6.3 Detail artikel dengan rich text `[confirmed]`

### M7: Admin Dashboard
**Status:** planned  
**Priority:** P1

Interface untuk Admin/Owner mengelola content.

**Features:**
- F7.1 Login/logout dengan HTTPS cookie-only auth `[stated]`
- F7.2 CRUD listing properti `[confirmed]`
- F7.3 Rich text editor (TipTap) untuk deskripsi `[confirmed]`
- F7.4 Image upload ke Vercel Blob dengan compression `[stated]`
- F7.5 CRUD artikel blog `[inferred]`

### M8: SEO & Performance
**Status:** planned  
**Priority:** P1

SEO optimization dengan ISG dan proper setup.

**Features:**
- F8.1 ISG (Incremental Static Generation) untuk halaman publik `[stated]`
- F8.2 Meta tags (title, description, OG, Twitter) `[stated]`
- F8.3 Sitemap generation `[stated]`
- F8.4 Structured data (JSON-LD) untuk properti `[stated]`
- F8.5 robots.txt `[stated]`
- F8.6 Image optimization dengan compression `[stated]`

---

## Constraints

| Constraint | Type | Notes |
|------------|------|-------|
| Platform: Next.js | Technical | `[confirmed]` |
| Architecture: Clean Architecture | Technical | `[stated]` - separation of concerns |
| ORM: Drizzle | Technical | `[confirmed]` |
| Database: Neon (PostgreSQL) | Technical | `[confirmed]` |
| State Management: TanStack Query | Technical | `[stated]` |
| Rich Text: TipTap | Technical | `[confirmed]` |
| Auth: HTTPS cookie-only | Technical | `[stated]` - secure, no localStorage |
| Rendering: ISG | Technical | `[stated]` - for SEO optimization |
| Image Storage: Vercel Blob | Technical | `[stated]` |
| Image Compression: Required | Technical | `[stated]` - for fast page render |
| Design: Elegant, warm, professional | Design | `[stated]` - premium property broker aesthetic |
| Typography: Serif headings + Sans body | Design | `[stated]` |
| Color: Orange accent + warm neutrals | Design | `[stated]` |
| Bahasa Indonesia only | Technical | `[confirmed]` - tidak perlu multi-bahasa |
| Mobile-first | Technical | Target user mengakses via smartphone `[inferred]` |
| Fast loading | Technical | Pengalaman user optimal `[inferred]` |
| WhatsApp primary channel | Business | Direct pre-filled message `[confirmed]` |
| Single role: Admin/Owner | Business | `[confirmed]` |
| Listing scale: < 100 | Business | `[confirmed]` |
| Priority: Lead generation | Business | `[confirmed]` |

---

## Branding (Confirmed)

| Item | Status |
|------|--------|
| Logo | Available `[confirmed]` |
| Primary Color | Orange `[confirmed]` |
| Accent Colors | Warm neutrals, soft green/gold `[stated]` |
| Typography | Serif headings + Sans body `[stated]` |
| Design Style | Elegant, warm, professional, premium `[stated]` |
| Design References | docs/design-inpirations/design-1.html - design-4.html `[stated]` |

---

## Confidence Markers

| Item | Confidence | Notes |
|------|------------|-------|
| Business model | High | `[stated]` |
| Target audience | High | `[stated]` |
| Tech stack | High | `[confirmed]` + `[stated]` |
| Architecture | High | `[stated]` - Clean Architecture |
| Design direction | High | `[stated]` - 4 design references provided |
| Primary goal | High | `[confirmed]` |
| Modules | Medium | `[inferred]` + `[confirmed]` mixed |

---

## Out of Scope (confirmed)
- Multi-bahasa `[confirmed]`
- Social media integration (feed embed, auto-post) `[confirmed]`
- Inquiry database storage (direct WhatsApp only) `[confirmed]`
- Portal listing multi-agen
- Sistem pembayaran online
- Multi-user CRM
- Aplikasi mobile native
