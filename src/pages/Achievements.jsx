import { motion } from 'framer-motion'
import { Trophy, Medal, Award, Star } from 'lucide-react'
import PageTransition, { staggerContainer, fadeInUp } from '../components/PageTransition'
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
                <h1 className="page-title">Prestasi</h1>
                <p className="page-subtitle">Pencapaian membanggakan dari kelas X TKJ 3</p>

                <motion.div className="achievements-grid" variants={staggerContainer} initial="initial" animate="animate">
                    {achievements.map(a => (
                        <motion.div key={a.id} className="achieve-card glass-card" variants={fadeInUp}>
                            <div className="achieve-icon" style={{ background: `${a.color}15`, color: a.color }}>
                                <a.icon size={28} />
                            </div>
                            <div className="achieve-body">
                                <span className="achieve-cat">{a.category}</span>
                                <h3>{a.title}</h3>
                                <p className="achieve-event">{a.event}</p>
                                <span className="achieve-year">{a.year}</span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </PageTransition>
    )
}
