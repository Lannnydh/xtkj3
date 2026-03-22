-- Migration Script 2: Menambahkan tabel Anggota, Galeri, Confess, Dokumen, Prestasi, Kontak
-- Serta setup Storage Bucket "kelas_images"
-- Silakan jalankan di SQL Editor Supabase

-- ==========================================
-- 1. SETUP STORAGE BUCKET (Untuk foto)
-- ==========================================
-- Membuat bucket public bernama "kelas_images"
INSERT INTO storage.buckets (id, name, public) 
VALUES ('kelas_images', 'kelas_images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy agar semua orang (public) bisa melihat/mendownload gambar
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'kelas_images');

-- Policy agar admin (authenticated) bisa upload gambar
CREATE POLICY "Auth Insert" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'kelas_images');

-- Policy agar admin bisa update gambar
CREATE POLICY "Auth Update" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'kelas_images');

-- Policy agar admin bisa hapus gambar
CREATE POLICY "Auth Delete" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'kelas_images');


-- ==========================================
-- 2. CREATE TABLES
-- ==========================================

-- Tabel Anggota Kelas
CREATE TABLE anggota (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(150) NOT NULL,
    peran VARCHAR(100) NOT NULL, -- 'Wali Kelas', 'Ketua Kelas', 'Murid', dll
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel Galeri
CREATE TABLE galeri (
    id SERIAL PRIMARY KEY,
    image_url TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel Confess (Menfess)
CREATE TABLE confess (
    id SERIAL PRIMARY KEY,
    pengirim VARCHAR(100) NOT NULL, -- Bisa 'Anonim' atau nama asli
    pesan TEXT NOT NULL,
    balasan TEXT,
    status VARCHAR(20) DEFAULT 'pending' NOT NULL, -- 'pending', 'approved', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel Dokumen
CREATE TABLE dokumen (
    id SERIAL PRIMARY KEY,
    nama_file VARCHAR(200) NOT NULL,
    tipe VARCHAR(50) NOT NULL, -- 'PDF', 'DOCX', 'XLSX', dll
    url_dokumen TEXT NOT NULL,
    deskripsi TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel Prestasi
CREATE TABLE prestasi (
    id SERIAL PRIMARY KEY,
    judul VARCHAR(200) NOT NULL,
    deskripsi TEXT NOT NULL,
    image_url TEXT,
    tanggal VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel Kontak
CREATE TABLE kontak (
    id SERIAL PRIMARY KEY,
    platform VARCHAR(100) NOT NULL, -- 'Instagram', 'TikTok', 'Email'
    username VARCHAR(100) NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- ==========================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE anggota ENABLE ROW LEVEL SECURITY;
ALTER TABLE galeri ENABLE ROW LEVEL SECURITY;
ALTER TABLE confess ENABLE ROW LEVEL SECURITY;
ALTER TABLE dokumen ENABLE ROW LEVEL SECURITY;
ALTER TABLE prestasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE kontak ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 4. RLS POLICIES
-- ==========================================

-- A. RLS BACA (SELECT) - Semua orang boleh baca
CREATE POLICY "Public read anggota" ON anggota FOR SELECT USING (true);
CREATE POLICY "Public read galeri" ON galeri FOR SELECT USING (true);
CREATE POLICY "Public read confess" ON confess FOR SELECT USING (true);
CREATE POLICY "Public read dokumen" ON dokumen FOR SELECT USING (true);
CREATE POLICY "Public read prestasi" ON prestasi FOR SELECT USING (true);
CREATE POLICY "Public read kontak" ON kontak FOR SELECT USING (true);

-- B. RLS TULIS (INSERT, UPDATE, DELETE) - Hanya Auth/Admin
-- Anggota
CREATE POLICY "Auth write anggota insert" ON anggota FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth write anggota update" ON anggota FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth write anggota delete" ON anggota FOR DELETE TO authenticated USING (true);

-- Galeri
CREATE POLICY "Auth write galeri insert" ON galeri FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth write galeri update" ON galeri FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth write galeri delete" ON galeri FOR DELETE TO authenticated USING (true);

-- Dokumen
CREATE POLICY "Auth write dokumen insert" ON dokumen FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth write dokumen update" ON dokumen FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth write dokumen delete" ON dokumen FOR DELETE TO authenticated USING (true);

-- Prestasi
CREATE POLICY "Auth write prestasi insert" ON prestasi FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth write prestasi update" ON prestasi FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth write prestasi delete" ON prestasi FOR DELETE TO authenticated USING (true);

-- Kontak
CREATE POLICY "Auth write kontak insert" ON kontak FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth write kontak update" ON kontak FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth write kontak delete" ON kontak FOR DELETE TO authenticated USING (true);

-- C. RLS KHUSUS UNTUK CONFESS
-- Publik boleh ngirim menfess (INSERT) !
CREATE POLICY "Public insert confess" ON confess FOR INSERT WITH CHECK (true);
-- Tapi cuma Admin yang boleh membalas, mengganti status, atau menghapus confess
CREATE POLICY "Auth write confess update" ON confess FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth write confess delete" ON confess FOR DELETE TO authenticated USING (true);


-- ==========================================
-- 5. SEED DATA AWAL (Contoh)
-- ==========================================
INSERT INTO kontak (platform, username, url) VALUES 
('Instagram', '@xtkj3.smkpgri', 'https://instagram.com/xtkj3.smkpgri'),
('Email', 'xtkj3@smkpgriwlingi.sch.id', 'mailto:xtkj3@smkpgriwlingi.sch.id');

INSERT INTO prestasi (judul, deskripsi, tanggal) VALUES 
('Juara 1 Lomba Web Design', 'Mewakili sekolah di tingkat kabupaten.', 'Agustus 2025');
