import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, BookOpen, FileText, Calendar, Megaphone, User, Bell } from 'lucide-react'
import PageTransition, { staggerContainer, fadeInUp, slideInLeft } from '../components/PageTransition'
import './Announcements.css'

const announcements = [
    { id: 1, title: 'UTS Semester Genap Dimulai Minggu Depan', date: '10 Feb 2026', author: 'Wali Kelas', category: 'ujian', status: 'aktif', desc: 'Persiapkan diri kalian, UTS dimulai tanggal 17 Februari. Materi dari awal semester.' },
    { id: 2, title: 'Pengumpulan Tugas PKK Terakhir', date: '8 Feb 2026', author: 'Ketua Kelas', category: 'tugas', status: 'aktif', desc: 'Deadline pengumpulan tugas PKK hari Jumat. Kumpul ke Google Classroom.' },
    { id: 3, title: 'Classmeeting Basket Antar Kelas', date: '5 Feb 2026', author: 'OSIS', category: 'event', status: 'aktif', desc: 'Daftar pemain basket max 7 orang. Hubungi seksi olahraga.' },
    { id: 4, title: 'Rapat Kelas Evaluasi Bulan Januari', date: '2 Feb 2026', author: 'Ketua Kelas', category: 'event', status: 'selesai', desc: 'Rapat evaluasi bulan Januari sudah dilaksanakan. Notulen tersedia di halaman Dokumen.' },
    { id: 5, title: 'Pembagian Kelompok Project ASJ', date: '28 Jan 2026', author: 'Wali Kelas', category: 'tugas', status: 'selesai', desc: 'Kelompok sudah dibagi. Cek di Google Classroom masing-masing.' },
    { id: 6, title: 'Jadwal Piket Bulan Februari Update', date: '27 Jan 2026', author: 'Sekretaris', category: 'tugas', status: 'aktif', desc: 'Jadwal piket bulan Februari sudah diupdate. Silakan cek di halaman Jadwal.' },
]

const categoryIcons = {
    ujian: FileText,
    tugas: BookOpen,
    event: Calendar,
}
const categoryColors = {
    ujian: 'var(--danger)',
    tugas: 'var(--info)',
    event: 'var(--warning)',
}

const filters = ['Semua', 'tugas', 'ujian', 'event']

export default function Announcements() {
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('Semua')

    const filtered = announcements.filter(a => {
        if (filter !== 'Semua' && a.category !== filter) return false
        if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false
        return true
    })

    return (
        <PageTransition>
            <div className="page-container">
                <motion.div className="announce-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="page-title">Pengumuman</h1>
                    <p className="page-subtitle">Info terbaru seputar tugas, ujian, dan event kelas</p>
                </motion.div>

                <motion.div
                    className="announce-toolbar"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            placeholder="Cari pengumuman..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="filter-chips">
                        {filters.map(f => (
                            <motion.button
                                key={f}
                                className={`chip ${filter === f ? 'active' : ''}`}
                                onClick={() => setFilter(f)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {f === 'Semua' ? 'Semua' : f.charAt(0).toUpperCase() + f.slice(1)}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                <motion.div className="announce-feed" variants={staggerContainer} initial="initial" animate="animate" key={filter + search}>
                    {filtered.map((a, i) => {
                        const Icon = categoryIcons[a.category] || Megaphone
                        const color = categoryColors[a.category] || 'var(--accent-primary)'
                        return (
                            <motion.div
                                key={a.id}
                                className="announce-card glass-card"
                                variants={fadeInUp}
                                whileHover={{ scale: 1.02, x: 5, boxShadow: '0 8px 30px rgba(99,102,241,0.1)' }}
                                transition={{ type: 'spring', stiffness: 300 }}
                                layout
                            >
                                <motion.div
                                    className="announce-icon"
                                    style={{ background: `${color}15`, color }}
                                    whileHover={{ rotate: 20, scale: 1.15 }}
                                >
                                    <Icon size={20} />
                                </motion.div>
                                <div className="announce-body">
                                    <div className="announce-top">
                                        <h3>{a.title}</h3>
                                        <motion.span
                                            className={`badge ${a.status === 'aktif' ? 'badge-success' : 'badge-warning'}`}
                                            animate={a.status === 'aktif' ? { scale: [1, 1.05, 1] } : {}}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            {a.status}
                                        </motion.span>
                                    </div>
                                    <p className="announce-desc">{a.desc}</p>
                                    <div className="announce-meta">
                                        <span><Calendar size={13} /> {a.date}</span>
                                        <span><User size={13} /> {a.author}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                    {filtered.length === 0 && <p className="empty-msg">Tidak ada pengumuman ditemukan.</p>}
                </motion.div>
            </div>
        </PageTransition>
    )
}
