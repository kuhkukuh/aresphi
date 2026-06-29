# User Flows — Aresphi Property

## Flow 1: Pembeli Mencari Properti

**Actor:** Pembeli Rumah / Investor Properti / Penyewa

**Status:** planned

### Narrative Journey
Pembeli mengunjung website Aresphi Property setelah melihat promosi digital atau rekomendasi. Di homepage, pembeli melihat hero section yang menjelaskan value proposition perusahaan dengan elegant typography dan subtle animations. Pembeli kemudian menavigasi ke katalog properti untuk melihat listing yang tersedia.

Pembeli menggunakan filter untuk menyaring properti berdasarkan tipe (jual/sewa), lokasi, rentang harga, dan kategori properti. Pembeli menemukan beberapa properti yang sesuai kriteria dan membuka detail masing-masing properti untuk melihat foto dengan gallery, deskripsi, dan spesifikasi.

Setelah menemukan properti yang diminati, pembeli mengklik tombol CTA WhatsApp yang langsung membuka chat dengan pre-filled message berisi informasi properti. Pembeli langsung terhubung dengan agen.

### Steps
1. Homepage → lihat value proposition dengan elegant hero
2. Katalog Properti → filter dan browse listing dengan card hover effects
3. Detail Properti → lihat foto gallery, harga, spesifikasi
4. CTA WhatsApp → pre-filled message langsung ke agen
5. Chat dengan agen (di luar website)

---

## Flow 2: Pemilik Properti Ingin Menjual/Menyewakan

**Actor:** Pemilik Properti

**Status:** planned

### Narrative Journey
Pemilik properti mengunjungi website untuk mencari informasi tentang layanan jual-beli atau sewa. Di halaman Layanan, pemilik membaca penjelasan tentang proses pemasaran properti, konsultasi harga pasar, dan pendampingan transaksi dengan visual presentation yang professional.

Pemilik tertarik dan menemukan form submit listing atau CTA konsultasi. Pemilik mengisi form singkat (nama, telepon, alamat properti). Saat submit, form membuka WhatsApp dengan pre-filled message berisi data yang sudah diisi.

Agen merespons dengan menjadwalkan survey properti dan memberikan estimasi harga pasar.

### Steps
1. Homepage → navigasi ke Layanan
2. Halaman Layanan → baca informasi jual-beli/sewa dengan card-based layout
3. Form Submit Listing → isi data properti
4. Submit → WhatsApp pre-filled message
5. Follow-up oleh agen → scheduling survey (di luar website)

---

## Flow 3: Investor Mencari Peluang Investasi

**Actor:** Investor Properti

**Status:** planned

### Narrative Journey
Investor mengunjungi website untuk mencari properti dengan potensi investasi. Investor membaca artikel/blog tentang market update dan tips investasi properti untuk memahami kondisi pasar saat ini.

Investor kemudian menavigasi ke katalog properti dan memfilter berdasarkan kriteria investasi (lokasi strategis, harga kompetitif, potensi capital gain). Investor menemukan beberapa kandidat dan mengklik WhatsApp untuk konsultasi lebih lanjut.

Agen memberikan insight tambahan tentang potensi investasi dan membantu investor dalam pengambilan keputusan.

### Steps
1. Blog/Artikel → baca market update, tips investasi
2. Katalog Properti → filter properti investasi
3. Detail Properti → analisis potensi
4. CTA WhatsApp → pre-filled message untuk konsultasi
5. Follow-up konsultasi oleh agen (di luar website)

---

## Flow 4: Pelaku Usaha Mencari Ruang Komersial

**Actor:** Pelaku Usaha/Perusahaan

**Status:** planned

### Narrative Journey
Pelaku usaha membutuhkan ruko, gudang, atau kantor untuk usahanya. Ia mengunjungi website dan langsung menavigasi ke kategori properti komersial di katalog. Setelah memfilter berdasarkan lokasi dan kebutuhan usaha, pelaku usaha menemukan beberapa opsi yang cocok.

Pelaku usaha mengklik WhatsApp untuk inquiry detail dan scheduling visit. Agen merespons dengan informasi tambahan dan jadwal survey lokasi.

### Steps
1. Homepage → langsung ke Katalog
2. Filter kategori komersial (ruko, gudang, kantor)
3. Detail Properti → cek spesifikasi dan lokasi dengan map integration
4. CTA WhatsApp → scheduling visit
5. Visit lokasi (di luar website)

---

## Flow 5: Calon Customer Ingin Mengenal Bisnis

**Actor:** Semua actor

**Status:** planned

### Narrative Journey
Calon customer menemukan nama Aresphi Property dari referensi atau social media. Ia mengunjungi website untuk mengetahui lebih lanjut tentang perusahaan. Di homepage, ia membaca tentang visi, misi, dan nilai-nilai perusahaan dengan scroll-triggered animations.

Ia melihat testimoni klien sebelumnya dan profil tim untuk membangun kepercayaan. Ia juga melihat statistik kredibilitas (jumlah transaksi, klien puas, tahun pengalaman) dengan animated counters.

Jika tertarik, ia menemukan floating WhatsApp button atau CTA di halaman untuk konsultasi awal.

### Steps
1. Homepage → baca tentang perusahaan dengan elegant presentation
2. Testimonial Section → lihat review klien dengan slider/carousel
3. Team Section → lihat profil agen
4. Stats Section → lihat kredibilitas dengan animated numbers
5. Floating WhatsApp / CTA → konsultasi awal

---

## Flow 6: Admin Mengelola Listing

**Actor:** Admin/Owner

**Status:** planned

### Narrative Journey
Admin login ke dashboard admin menggunakan HTTPS cookie-based authentication. Session disimpan securely di HttpOnly cookie. Admin mengakses halaman property management untuk menambah listing properti baru.

Admin mengisi form dengan detail properti: judul, kategori, harga, lokasi, spesifikasi. Untuk deskripsi, admin menggunakan TipTap rich text editor. Admin mengupload foto properti - sebelum upload, sistem melakukan kompresi otomatis (WebP format, max 1920x1080, 80% quality) ke Vercel Blob.

Listing disimpan ke database via TanStack Query mutation. Setelah sukses, cache di-invalidate dan halaman katalog publik di-revalidate untuk ISG.

Admin juga dapat mengedit listing yang ada, mengubah status (available/sold/rented), atau menghapus listing.

### Steps
1. Login → HTTPS cookie session
2. Dashboard → Property management dengan clean UI
3. Tambah listing → isi form + TipTap deskripsi
4. Upload foto → auto-compress → Vercel Blob
5. Submit → TanStack Query mutation → save to DB
6. ISG revalidation → tampil di website

---

## Flow 7: Admin Mengelola Blog

**Actor:** Admin/Owner

**Status:** planned

### Narrative Journey
Admin mengakses section blog di dashboard untuk menulis artikel properti. Admin menggunakan TipTap rich text editor untuk konten artikel.

Admin mengupload featured image (auto-compressed). Artikel disimpan dan dipublikasikan via TanStack Query mutation. ISG revalidation triggered untuk halaman blog.

### Steps
1. Dashboard → Blog section
2. Tambah artikel → TipTap editor
3. Upload featured image → auto-compress
4. Publish → mutation → ISG revalidation
5. Artikel tampil di halaman blog

---

## Flow 8: Search Engine Crawling

**Actor:** Search Engine Bot (Google, etc.)

**Status:** planned

### Narrative Journey
Search engine bot meng-crawl website Aresphi Property. Setiap halaman memiliki meta tags lengkap (title, description, OG, Twitter) dan structured data (JSON-LD).

Sitemap.xml memberikan daftar semua URL yang valid. robots.txt memblokir /admin dan /api dari indexing.

Halaman properti dan blog di-generate secara statis (ISG) dengan revalidation period, memberikan HTML lengkap dengan structured data untuk SEO optimal.

### Steps
1. Bot fetches sitemap.xml
2. Bot crawls each URL
3. Each page serves pre-rendered HTML (ISG)
4. Meta tags + structured data parsed
5. Page indexed with proper SEO metadata

---

## Module Status Summary

| Module | Status |
|--------|--------|
| Company Profile | planned |
| Katalog Properti | planned |
| Layanan | planned |
| Lead Generation | planned |
| Kontak | planned |
| Blog/Artikel | planned |
| Admin Dashboard | planned |
| SEO & Performance | planned |
