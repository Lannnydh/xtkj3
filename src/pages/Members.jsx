import { motion } from 'framer-motion'
import { Crown, Star, Shield, Coins, Search, Loader } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import PageTransition, { staggerContainer, fadeInUp, bounceIn } from '../components/PageTransition'
import './Members.css'

function getInitials(name) {
    if (!name) return ''
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function hashColor(name) {
    if (!name) return '#6366f1'
    let hash = 0
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
    const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e', '#10b981', '#3b82f6', '#f59e0b', '#14b8a6', '#f97316']
    return colors[Math.abs(hash) % colors.length]
}

function getRoleIcon(role) {
    const r = role.toLowerCase()
    if (r.includes('ketua')) return Crown
    if (r.includes('wakil')) return Shield
    if (r.includes('bendahara') || r.includes('sekretaris')) return Coins
    return Star
}

export default function Members() {
    const [members, setMembers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const { data, error } = await supabase
                    .from('anggota')
                    .select('*')
                    .order('nama', { ascending: true })

                if (error) throw error
                setMembers(data)
            } catch (error) {
                console.error('Error fetching members:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchMembers()
    }, [])

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '16px' }}>
                <Loader className="spin text-primary" size={40} />
                <p>Memuat data anggota...</p>
            </div>
        )
    }

    const waliKelas = members.find(m => m.peran.toLowerCase().includes('wali'))
    const pengurus = members.filter(m => m.peran.toLowerCase() !== 'murid' && m.peran.toLowerCase() !== 'siswa' && !m.peran.toLowerCase().includes('wali'))
    const allStudents = members.filter(m => !m.peran.toLowerCase().includes('wali'))

    const filteredStudents = allStudents.filter(m =>
        m.nama.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <PageTransition>
            <div className="page-container">
                <motion.h1 className="page-title" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>Anggota Kelas</motion.h1>
                <motion.p className="page-subtitle" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>{allStudents.length} siswa + wali kelas X TKJ 3 — SMK PGRI Wlingi</motion.p>

                {/* Wali Kelas */}
                {waliKelas && (
                    <motion.div
                        className="wali-card"
                        initial={{ opacity: 0, scale: 0.85, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                        whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(99,102,241,0.25)' }}
                    >
                        {waliKelas.photo_url ? (
                            <div className="wali-avatar" style={{ padding: 0, background: 'transparent' }}>
                                <img src={waliKelas.photo_url} alt={waliKelas.nama} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '24px' }} />
                            </div>
                        ) : (
                            <motion.div
                                className="wali-avatar"
                                animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <Star size={28} />
                            </motion.div>
                        )}
                        <div className="wali-info">
                            <span className="wali-badge">{waliKelas.peran}</span>
                            <h2>{waliKelas.nama}</h2>
                        </div>
                    </motion.div>
                )}

                {/* Pengurus */}
                {pengurus.length > 0 && (
                    <>
                        <motion.h2 className="section-heading" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>Struktur Pengurus</motion.h2>
                        <motion.div className="pengurus-grid" variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
                            {pengurus.map((p) => {
                                const RoleIcon = getRoleIcon(p.peran)
                                return (
                                    <motion.div
                                        key={p.id}
                                        className="pengurus-card glass-card"
                                        variants={bounceIn}
                                        whileHover={{ scale: 1.05, rotate: 1, boxShadow: '0 0 30px rgba(99,102,241,0.2)' }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                    >
                                        <motion.div
                                            className="member-avatar"
                                            style={p.photo_url ? { background: 'transparent', padding: 0 } : { background: `${hashColor(p.nama)}20`, color: hashColor(p.nama) }}
                                            whileHover={{ scale: 1.15, rotate: p.photo_url ? 0 : 10 }}
                                        >
                                            {p.photo_url ? (
                                                <img src={p.photo_url} alt={p.nama} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                            ) : getInitials(p.nama)}
                                        </motion.div>
                                        <h3>{p.nama}</h3>
                                        <div className="role-badge">
                                            <motion.span animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                                                <RoleIcon size={12} />
                                            </motion.span>
                                            <span>{p.peran}</span>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </motion.div>
                    </>
                )}

                {/* Search */}
                <motion.h2 className="section-heading" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>Semua Siswa</motion.h2>
                <motion.div className="member-search" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Cari nama siswa..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </motion.div>

                {/* All members */}
                <motion.div className="members-grid" variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
                    {filteredStudents.map((m, i) => {
                        return (
                            <motion.div
                                key={m.id}
                                className="member-card glass-card"
                                variants={fadeInUp}
                                whileHover={{ scale: 1.08, y: -8, boxShadow: '0 12px 30px rgba(99,102,241,0.15)' }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                layout
                            >
                                <motion.div
                                    className="member-avatar"
                                    style={m.photo_url ? { background: 'transparent', padding: 0 } : { background: `${hashColor(m.nama)}15`, color: hashColor(m.nama) }}
                                    whileHover={{ rotate: m.photo_url ? 0 : 15, scale: 1.1 }}
                                >
                                    {m.photo_url ? (
                                        <img src={m.photo_url} alt={m.nama} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                    ) : getInitials(m.nama)}
                                </motion.div>
                                <h4>{m.nama}</h4>
                                {m.peran.toLowerCase() !== 'murid' && m.peran.toLowerCase() !== 'siswa' && <span className="mini-role">{m.peran}</span>}
                            </motion.div>
                        )
                    })}
                </motion.div>
                {filteredStudents.length === 0 && <p className="empty-msg">Tidak ditemukan siswa dengan nama tersebut.</p>}
            </div>
        </PageTransition>
    )
}
