import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { Users, FolderKanban, CalendarDays, Megaphone, ChevronRight, Sparkles, BookOpen, Trophy, Zap, GraduationCap } from 'lucide-react'
import PageTransition, { staggerContainer, fadeInUp, scaleIn, bounceIn } from '../components/PageTransition'
import './Home.css'

const stats = [
    { icon: Users, value: 35, label: 'Siswa', color: '#6366f1' },
    { icon: FolderKanban, value: 12, label: 'Projek', color: '#8b5cf6' },
    { icon: CalendarDays, value: 24, label: 'Event', color: '#a855f7' },
    { icon: Trophy, value: 8, label: 'Prestasi', color: '#ec4899' },
]

const quickLinks = [
    { icon: BookOpen, label: 'Jadwal Pelajaran', desc: 'Senin sampai Sabtu, lengkap dengan piket & ujian', to: '/schedule', color: '#6366f1' },
    { icon: Megaphone, label: 'Pengumuman Terbaru', desc: 'Info tugas, ujian, dan event kelas terkini', to: '/announcements', color: '#f59e0b' },
    { icon: Users, label: 'Anggota Kelas', desc: '35 siswa + wali kelas, lengkap dengan struktur', to: '/members', color: '#10b981' },
    { icon: FolderKanban, label: 'Daftar Tugas', desc: 'Tracking tugas harian & mingguan, kanban view', to: '/tasks', color: '#ef4444' },
]

// Counter animation component
function AnimatedCounter({ value, duration = 2 }) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        let start = 0
        const end = parseInt(value)
        const increment = end / (duration * 60)
        const timer = setInterval(() => {
            start += increment
            if (start >= end) {
                setCount(end)
                clearInterval(timer)
            } else {
                setCount(Math.floor(start))
            }
        }, 1000 / 60)
        return () => clearInterval(timer)
    }, [value, duration])

    return <>{count}</>
}

// Floating particles component
function FloatingParticles() {
    return (
        <div className="floating-particles">
            {[...Array(25)].map((_, i) => (
                <motion.div
                    key={i}
                    className="particle"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: `${2 + Math.random() * 4}px`,
                        height: `${2 + Math.random() * 4}px`,
                    }}
                    animate={{
                        y: [0, -30 - Math.random() * 50, 0],
                        x: [0, (Math.random() - 0.5) * 40, 0],
                        opacity: [0, 0.7, 0],
                        scale: [0, 1.2, 0],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 5,
                        repeat: Infinity,
                        delay: Math.random() * 3,
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </div>
    )
}

export default function Home() {
    return (
        <PageTransition>
            {/* Hero */}
            <section className="hero">
                <div className="hero-bg-orbs">
                    <motion.div className="orb orb-1" animate={{ y: [0, -30, 0], x: [0, 15, 0], scale: [1, 1.1, 1] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
                    <motion.div className="orb orb-2" animate={{ y: [0, 20, 0], x: [0, -20, 0], scale: [1, 0.9, 1] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
                    <motion.div className="orb orb-3" animate={{ y: [0, -15, 0], x: [0, 10, 0], rotate: [0, 180, 360] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} />
                    <motion.div className="orb orb-4" animate={{ y: [0, 25, 0], x: [0, -15, 0], scale: [0.8, 1.2, 0.8] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} />
                </div>
                <FloatingParticles />
                <div className="hero-content">
                    <motion.div
                        className="hero-logo-wrap"
                        initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ delay: 0.1, duration: 0.7, type: 'spring' }}
                    >
                        <motion.img
                            src="/logo-smk.png"
                            alt="Logo SMK PGRI Wlingi"
                            className="hero-logo"
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                            whileHover={{ scale: 1.15, rotate: 15 }}
                        />
                    </motion.div>
                    <motion.div
                        className="hero-badge"
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <motion.span animate={{ rotate: [0, 20, -20, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                            <Sparkles size={14} />
                        </motion.span>
                        <span>SMK PGRI Wlingi — Tahun Ajaran 2025/2026</span>
                    </motion.div>
                    <motion.h1
                        className="hero-title"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                    >
                        Kelas X<br /><span className="gradient-text">TKJ 3</span>
                    </motion.h1>
                    <motion.p
                        className="hero-tagline"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        Solid — Kreatif — Berprestasi. Portal resmi kelas yang menyatukan informasi, kolaborasi, dan dokumentasi kita.
                    </motion.p>
                    <motion.div
                        className="hero-actions"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                    >
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link to="/schedule" className="btn-primary"><CalendarDays size={18} /> Lihat Jadwal</Link>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link to="/announcements" className="btn-outline"><Megaphone size={18} /> Pengumuman</Link>
                        </motion.div>
                    </motion.div>

                    {/* Scroll indicator */}
                    <motion.div
                        className="scroll-indicator"
                        animate={{ y: [0, 10, 0], opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <ChevronRight size={20} style={{ transform: 'rotate(90deg)' }} />
                    </motion.div>
                </div>
            </section>

            {/* Stats */}
            <motion.section className="stats-section" variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true, margin: "-50px" }}>
                <div className="stats-grid">
                    {stats.map((s, i) => (
                        <motion.div
                            key={i}
                            className="stat-card glass-card"
                            variants={bounceIn}
                            whileHover={{ scale: 1.08, y: -5, boxShadow: `0 0 30px ${s.color}20` }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <motion.div
                                className="stat-icon"
                                style={{ background: `${s.color}15`, color: s.color }}
                                whileHover={{ rotate: 15, scale: 1.15 }}
                                animate={{ y: [0, -3, 0] }}
                                transition={{ duration: 2 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <s.icon size={24} />
                            </motion.div>
                            <motion.div
                                className="stat-value"
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, type: 'spring' }}
                            >
                                <AnimatedCounter value={s.value} />
                            </motion.div>
                            <div className="stat-label">{s.label}</div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Quick Links */}
            <motion.section className="quick-section" variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true, margin: "-50px" }}>
                <motion.h2
                    className="section-title"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <motion.span animate={{ rotate: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
                        <Zap size={22} className="section-icon" />
                    </motion.span>
                    Akses Cepat
                </motion.h2>
                <div className="quick-grid">
                    {quickLinks.map((q, i) => (
                        <motion.div key={i} variants={fadeInUp}>
                            <Link to={q.to} className="quick-card glass-card">
                                <motion.div
                                    className="quick-icon"
                                    style={{ background: `${q.color}15`, color: q.color }}
                                    whileHover={{ rotate: 15, scale: 1.15 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    <q.icon size={22} />
                                </motion.div>
                                <div className="quick-info">
                                    <h3>{q.label}</h3>
                                    <p>{q.desc}</p>
                                </div>
                                <motion.div
                                    className="quick-arrow-wrap"
                                    whileHover={{ x: 5 }}
                                >
                                    <ChevronRight size={18} className="quick-arrow" />
                                </motion.div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.section>
        </PageTransition>
    )
}
