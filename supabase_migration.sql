-- Supabase Migration Script untuk Website Kelas X TKJ 3
-- Silakan jalankan script ini di menu "SQL Editor" pada Supabase Dashboard.

-- ==============================================================================
-- 1. BUAT TABEL
-- ==============================================================================

-- Tabel Jadwal
CREATE TABLE jadwal (
    id SERIAL PRIMARY KEY,
    hari VARCHAR(20) NOT NULL,
    jam_ke VARCHAR(10) NOT NULL, -- bisa integer (1,2) atau string ("Istirahat")
    waktu VARCHAR(20) NOT NULL,
    mata_pelajaran VARCHAR(100),
    guru VARCHAR(100)
);

-- Tabel Piket
CREATE TABLE piket (
    id SERIAL PRIMARY KEY,
    hari VARCHAR(20) NOT NULL,
    nama_siswa VARCHAR(100) NOT NULL
);

-- Tabel Pengumuman
CREATE TABLE pengumuman (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    deskripsi TEXT NOT NULL,
    date VARCHAR(50) NOT NULL,
    author VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'tugas', 'ujian', 'event'
    status VARCHAR(50) NOT NULL,   -- 'aktif', 'selesai'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabel Tugas
CREATE TABLE tugas (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    mapel VARCHAR(100) NOT NULL,
    deadline VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'todo', 'progress', 'done'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 2. SET ROW LEVEL SECURITY (RLS)
-- Semua orang bisa BACA (select), hanya Admin (authenticated) yg bisa TULIS (insert, update, delete)
-- ==============================================================================

-- Aktifkan RLS untuk semua tabel
ALTER TABLE jadwal ENABLE ROW LEVEL SECURITY;
ALTER TABLE piket ENABLE ROW LEVEL SECURITY;
ALTER TABLE pengumuman ENABLE ROW LEVEL SECURITY;
ALTER TABLE tugas ENABLE ROW LEVEL SECURITY;

-- Kebijakan SELECT (Bisa dibaca publik/anonim)
CREATE POLICY "Public read jadwal" ON jadwal FOR SELECT USING (true);
CREATE POLICY "Public read piket" ON piket FOR SELECT USING (true);
CREATE POLICY "Public read pengumuman" ON pengumuman FOR SELECT USING (true);
CREATE POLICY "Public read tugas" ON tugas FOR SELECT USING (true);

-- Kebijakan INSERT, UPDATE, DELETE (Hanya user yang sudah login/auth)
-- Jadwal
CREATE POLICY "Auth write jadwal insert" ON jadwal FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth write jadwal update" ON jadwal FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth write jadwal delete" ON jadwal FOR DELETE TO authenticated USING (true);

-- Piket
CREATE POLICY "Auth write piket insert" ON piket FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth write piket update" ON piket FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth write piket delete" ON piket FOR DELETE TO authenticated USING (true);

-- Pengumuman
CREATE POLICY "Auth write pengumuman insert" ON pengumuman FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth write pengumuman update" ON pengumuman FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth write pengumuman delete" ON pengumuman FOR DELETE TO authenticated USING (true);

-- Tugas
CREATE POLICY "Auth write tugas insert" ON tugas FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth write tugas update" ON tugas FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth write tugas delete" ON tugas FOR DELETE TO authenticated USING (true);


-- ==============================================================================
-- 3. INSERT DATA AWAL (SEED DATA dari aplikasi React sebelumnya)
-- ==============================================================================

-- 3A. Insert Jadwal (contoh dari hari Senin - Sabtu)
INSERT INTO jadwal (hari, jam_ke, waktu, mata_pelajaran) VALUES
('Senin', '1', '07:00 - 07:45', 'Matematika'),
('Senin', '2', '07:45 - 08:30', 'Matematika'),
('Senin', '3', '08:30 - 09:15', 'Matematika'),
('Senin', '4', '09:15 - 10:00', 'Matematika'),
('Senin', 'Istirahat', '10:00 - 10:15', ''),
('Senin', '5', '10:15 - 11:00', 'BING'),
('Senin', '6', '11:00 - 11:45', 'BING'),
('Senin', '7', '11:45 - 12:30', 'BINA'),
('Senin', '8', '12:30 - 13:15', 'BINA'),
('Senin', 'Istirahat', '13:15 - 13:30', ''),
('Senin', '9', '13:30 - 14:10', 'BINA'),
('Senin', '10', '14:10 - 14:50', 'BINA'),

('Selasa', '1', '07:00 - 07:45', 'Informatika'),
('Selasa', '2', '07:45 - 08:30', 'Informatika'),
('Selasa', '3', '08:30 - 09:15', 'Informatika'),
('Selasa', '4', '09:15 - 10:00', 'Informatika'),
('Selasa', 'Istirahat', '10:00 - 10:15', ''),
('Selasa', '5', '10:15 - 11:00', 'DDP1'),
('Selasa', '6', '11:00 - 11:45', 'DDP1'),
('Selasa', '7', '11:45 - 12:30', 'DDP1'),
('Selasa', '8', '12:30 - 13:15', 'DDP1'),
('Selasa', 'Istirahat', '13:15 - 13:30', ''),
('Selasa', '9', '13:30 - 14:10', 'Mulok Produktif'),
('Selasa', '10', '14:10 - 14:50', 'Mulok Produktif'),

('Rabu', '1', '07:00 - 07:45', 'Sejarah'),
('Rabu', '2', '07:45 - 08:30', 'Sejarah'),
('Rabu', '3', '08:30 - 09:15', 'Seni Budaya'),
('Rabu', '4', '09:15 - 10:00', 'Seni Budaya'),
('Rabu', 'Istirahat', '10:00 - 10:15', ''),
('Rabu', '5', '10:15 - 11:00', 'Penjas Orkes'),
('Rabu', '6', '11:00 - 11:45', 'Penjas Orkes'),
('Rabu', '7', '11:45 - 12:30', 'Penjas Orkes'),
('Rabu', '8', '12:30 - 13:15', 'PABP'),
('Rabu', 'Istirahat', '13:15 - 13:30', ''),
('Rabu', '9', '13:30 - 14:10', 'PABP'),
('Rabu', '10', '14:10 - 14:50', 'PABP'),

('Kamis', '1', '07:00 - 07:45', 'DDP2'),
('Kamis', '2', '07:45 - 08:30', 'DDP2'),
('Kamis', '3', '08:30 - 09:15', 'DDP2'),
('Kamis', '4', '09:15 - 10:00', 'DDP2'),
('Kamis', 'Istirahat', '10:00 - 10:15', ''),
('Kamis', '5', '10:15 - 11:00', 'TJKT3'),
('Kamis', '6', '11:00 - 11:45', 'TJKT3'),
('Kamis', '7', '11:45 - 12:30', 'TJKT3'),
('Kamis', '8', '12:30 - 13:15', 'TJKT3'),
('Kamis', 'Istirahat', '13:15 - 13:30', ''),
('Kamis', '9', '13:30 - 14:10', 'PGRI'),
('Kamis', '10', '14:10 - 14:50', 'Bahasa Jepang'),

('Jumat', '1', '07:00 - 07:45', 'PPKN'),
('Jumat', '2', '07:45 - 08:30', 'PPKN'),
('Jumat', '3', '08:30 - 09:15', 'BING'),
('Jumat', '4', '09:15 - 10:00', 'BING'),
('Jumat', 'Istirahat', '10:00 - 10:15', ''),
('Jumat', '5', '10:15 - 11:00', 'Bahasa Jawa'),
('Jumat', '6', '11:00 - 11:45', 'BP BK'),
('Jumat', 'Istirahat', '11:45 - 13:00', ''),
('Jumat', '7', '13:00 - 13:40', ''),
('Jumat', '8', '13:40 - 14:20', ''),
('Jumat', '9', '14:20 - 15:00', 'Pramuka'),
('Jumat', '10', '15:00 - 15:40', 'Pramuka'),

('Sabtu', '1', '07:00 - 07:45', ''),
('Sabtu', '2', '07:45 - 08:30', 'Mulok'),
('Sabtu', '3', '08:30 - 09:15', 'Projek IPAS'),
('Sabtu', '4', '09:15 - 10:00', 'Projek IPAS'),
('Sabtu', 'Istirahat', '10:00 - 10:15', ''),
('Sabtu', '5', '10:15 - 11:00', 'Projek IPAS'),
('Sabtu', '6', '11:00 - 11:45', 'Projek IPAS'),
('Sabtu', '7', '11:45 - 12:30', 'Projek IPAS'),
('Sabtu', '8', '12:30 - 13:15', 'Projek IPAS');

-- 3B. Insert Piket
INSERT INTO piket (hari, nama_siswa) VALUES
('Senin', 'Elvira'), ('Senin', 'Enesia'), ('Senin', 'Erawati'), ('Senin', 'Estianza'), ('Senin', 'Faulina'), ('Senin', 'Favian'),
('Selasa', 'Faza'), ('Selasa', 'Fellia'), ('Selasa', 'Fitria'), ('Selasa', 'Hanafi'), ('Selasa', 'Hendy'), ('Selasa', 'Hesti'),
('Rabu', 'Heven'), ('Rabu', 'Icha'), ('Rabu', 'Ilham'), ('Rabu', 'Intan'), ('Rabu', 'Irsqah'), ('Rabu', 'Jasson'),
('Kamis', 'Jenita'), ('Kamis', 'Jessica'), ('Kamis', 'Jevelin'), ('Kamis', 'Jua'), ('Kamis', 'Kafina'), ('Kamis', 'Keand'),
('Jumat', 'Kervin'), ('Jumat', 'Kevin'), ('Jumat', 'Layli'), ('Jumat', 'Lensi'), ('Jumat', 'Lina'), ('Jumat', 'Lutfiana'),
('Sabtu', 'Marchel'), ('Sabtu', 'Maulana'), ('Sabtu', 'Melisa'), ('Sabtu', 'Mikael'), ('Sabtu', 'Mochammad');

-- 3C. Insert Pengumuman
INSERT INTO pengumuman (title, deskripsi, date, author, category, status) VALUES
('UTS Semester Genap Dimulai Minggu Depan', 'Persiapkan diri kalian, UTS dimulai tanggal 17 Februari. Materi dari awal semester.', '10 Feb 2026', 'Wali Kelas', 'ujian', 'aktif'),
('Pengumpulan Tugas PKK Terakhir', 'Deadline pengumpulan tugas PKK hari Jumat. Kumpul ke Google Classroom.', '8 Feb 2026', 'Ketua Kelas', 'tugas', 'aktif'),
('Classmeeting Basket Antar Kelas', 'Daftar pemain basket max 7 orang. Hubungi seksi olahraga.', '5 Feb 2026', 'OSIS', 'event', 'aktif'),
('Rapat Kelas Evaluasi Bulan Januari', 'Rapat evaluasi bulan Januari sudah dilaksanakan. Notulen tersedia di halaman Dokumen.', '2 Feb 2026', 'Ketua Kelas', 'event', 'selesai'),
('Pembagian Kelompok Project ASJ', 'Kelompok sudah dibagi. Cek di Google Classroom masing-masing.', '28 Jan 2026', 'Wali Kelas', 'tugas', 'selesai'),
('Jadwal Piket Bulan Februari Update', 'Jadwal piket bulan Februari sudah diupdate. Silakan cek di halaman Jadwal.', '27 Jan 2026', 'Sekretaris', 'tugas', 'aktif');

-- 3D. Insert Tugas
INSERT INTO tugas (name, mapel, deadline, status) VALUES
('Laporan Praktek ASJ', 'ASJ', '14 Feb 2026', 'done'),
('Presentasi PKK Kelompok 3', 'PKK', '16 Feb 2026', 'progress'),
('Essay B. Indonesia', 'B. Indonesia', '15 Feb 2026', 'todo'),
('Soal Latihan Matematika Bab 5', 'Matematika', '17 Feb 2026', 'todo'),
('Rangkuman Fisika Semester 2', 'Fisika', '18 Feb 2026', 'progress'),
('Project Jaringan Komputer', 'Komputer Jaringan', '20 Feb 2026', 'todo'),
('Tugas TLJ Konfigurasi VoIP', 'TLJ', '13 Feb 2026', 'done'),
('Poster Hari Bahasa Inggris', 'B. Inggris', '19 Feb 2026', 'progress');
