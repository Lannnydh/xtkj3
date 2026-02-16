import { motion } from 'framer-motion'
import { Trophy, Medal, Award, Star } from 'lucide-react'
import PageTransition, { staggerContainer, bounceIn } from '../components/PageTransition'
import './Achievements.css'

const achievements = [
    { id: 1, title: 'Juara 1 Lomba Jaringan Komputer', event: 'LKS Tingkat Kota', year: '2026', category: 'Akademik', icon: Trophy, color: '#f59e0b' },
    { id: 2, title: 'Juara 2 Classmeeting Basket', event: 'Classmeeting Semester 1', year: '2025', category: 'Olahraga', icon: Medal, color: '#8b5cf6' },
    { id: 3, title: 'Best Presentation PKK', event: 'Expo Produk Kreatif', year: '2025', category: 'Akademik', icon: Award, color: '#6366f1' },
    { id: 4, title: 'Juara 3 Lomba Debat B. Inggris', event: 'English Competition', year: '2025', category: 'Akademik', icon: Medal, color: '#10b981' },
    { id: 5, title: 'Kelas Terbersih Bulan Desember', event: 'Award Bulanan Sekolah', year: '2025', category: 'Kebersihan', icon: Star, color: '#ec4899' },
    { id: 6, title: 'Juara 1 Futsal Antar Kelas', event: 'Sport Event OSIS', year: '2025', category: 'Olahraga', icon: Trophy, color: '#f59e0b' },
    { id: 7, title: 'Siswa Berprestasi Semester 1', event: 'Award Sekolah — Andi Pratama', year: '2025', category: 'Akademik', icon: Star, color: '#3b82f6' },
    { id: 8, title: 'Juara Harapan Lomba Poster Hari Guru', event: 'Peringatan Hari Guru', year: '2025', category: 'Seni', icon: Award, color: '#a855f7' },
]

export default function Achievements() {
    return (
        <PageTransition>
            <div className="page-container">
                <motion.h1 className="page-title" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>Prestasi</motion.h1>
                <motion.p className="page-subtitle" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>Pencapaian membanggakan dari kelas X TKJ 3</motion.p>

                <motion.div className="achievements-grid" variants={staggerContainer} initial="initial" animate="animate">
                    {achievements.map((a, i) => (
                        <motion.div
                            key={a.id}
                            className="achieve-card glass-card"
                            variants={bounceIn}
                            whileHover={{
                                scale: 1.05,
                                y: -8,
                                boxShadow: `0 12px 40px ${a.color}20`
                            }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <motion.div
                                className="achieve-icon"
                                style={{ background: `${a.color}15`, color: a.color }}
                                whileHover={{ rotate: 20, scale: 1.2 }}
                                animate={{ y: [0, -3, 0] }}
                                transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <a.icon size={28} />
                            </motion.div>
                            <div className="achieve-body">
                                <motion.span
                                    className="achieve-cat"
                                    whileHover={{ scale: 1.1 }}
                                >
                                    {a.category}
                                </motion.span>
                                <h3>{a.title}</h3>
                                <p className="achieve-event">{a.event}</p>
                                <span className="achieve-year">{a.year}</span>
                            </div>
                            <div className="achieve-shine" />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </PageTransition>
    )
}
