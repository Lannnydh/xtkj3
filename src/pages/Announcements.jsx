import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, BookOpen, FileText, Calendar, Megaphone, User, Loader } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import PageTransition, { staggerContainer, fadeInUp } from '../components/PageTransition'
import './Announcements.css'

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
    const [announcements, setAnnouncements] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                setLoading(true)
                const { data, error } = await supabase
                    .from('pengumuman')
                    .select('*')
                    .order('created_at', { ascending: false })

                if (error) throw error
                setAnnouncements(data || [])
            } catch (err) {
                console.error("Error fetching announcements:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchAnnouncements()
    }, [])

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

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
                        <Loader className="spin" size={32} style={{ color: 'var(--accent-primary)' }} />
                    </div>
                ) : (
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
                                        <p className="announce-desc">{a.deskripsi}</p>
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
                )}
            </div>
        </PageTransition>
    )
}

