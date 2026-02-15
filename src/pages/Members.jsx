import { motion } from 'framer-motion'
import { Crown, Star, Shield, Coins } from 'lucide-react'
import PageTransition, { staggerContainer, fadeInUp } from '../components/PageTransition'
import './Members.css'

const waliKelas = { name: 'Syahfira Yaumi Khoirun Annisa, S.Pd', role: 'Wali Kelas' }

const pengurus = [
    { name: 'Heven Jovanska Bertha Satria', role: 'Ketua Kelas', icon: Crown },
    { name: 'Keand Gandung Permana', role: 'Wakil Ketua', icon: Shield },
    { name: 'Jenita Ayu Nofi Yanti', role: 'Bendahara 1', icon: Coins },
    { name: 'Lutfiana Cahya Imadany', role: 'Bendahara 2', icon: Coins },
]

const allStudents = [
    'Elvira Nur Fitriya',
    'Enesia Giana Putiri',
    'Erawati',
    'Estianza Adinca Flovirensya',
    'Faulina Nuraini Putri',
    'Favian Mahmud Adi Pratama',
    'Faza Ahmad Al Fariszy',
    'Fellia Nia Hani Maharani',
    'Fitria Ningsih',
    'Hanafi Wardana Putra',
    'Hendy Setyawan',
    'Hesti Maulidya',
    'Heven Jovanska Bertha Satria',
    'Icha Allyakeysa Billa',
    'Ilham Mifdhal Febriansyah',
    'Intan Tia Cahyani',
    'Irsqah Kendol Widianda',
    'Jasson Wong Zhern Jiee',
    'Jenita Ayu Nofi Yanti',
    'Jessica Putri Wiyana',
    'Jevelin Beby Diamond',
    'Jua Alivia Febianiroh',
    'Kafina Fitri Devikayasna',
    'Keand Gandung Permana',
    'Kervin Artha Billah',
    'Kevin Fataqur Rasya',
    'Layli Nuraini',
    'Lensi Kurniasari',
    'Lina Faizatul Fitria',
    'Lutfiana Cahya Imadany',
    'Marchel Imajesta Setya Permadhani',
    'Maulana Yudha Pratama',
    'Melisa Dwi Maulidia',
    'Mikael Candra',
    'Mochammad Saka Syahwanis',
]

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function hashColor(name) {
    let hash = 0
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
    const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e', '#10b981', '#3b82f6', '#f59e0b', '#14b8a6', '#f97316']
    return colors[Math.abs(hash) % colors.length]
}

export default function Members() {
    return (
        <PageTransition>
            <div className="page-container">
                <motion.h1 className="page-title" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>Anggota Kelas</motion.h1>
                <motion.p className="page-subtitle" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>35 siswa + wali kelas X TKJ 3 — SMK PGRI Wlingi</motion.p>

                {/* Wali Kelas */}
                <motion.div
                    className="wali-card"
                    initial={{ opacity: 0, scale: 0.85, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(99,102,241,0.25)' }}
                >
                    <motion.div
                        className="wali-avatar"
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <Star size={28} />
                    </motion.div>
                    <div className="wali-info">
                        <span className="wali-badge">Wali Kelas</span>
                        <h2>{waliKelas.name}</h2>
                    </div>
                </motion.div>

                {/* Pengurus */}
                <motion.h2 className="section-heading" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>Struktur Pengurus</motion.h2>
                <motion.div className="pengurus-grid" variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
                    {pengurus.map((p, i) => (
                        <motion.div
                            key={i}
                            className="pengurus-card glass-card"
                            variants={fadeInUp}
                            whileHover={{ scale: 1.05, rotate: 1, boxShadow: '0 0 30px rgba(99,102,241,0.2)' }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            <div className="member-avatar" style={{ background: `${hashColor(p.name)}20`, color: hashColor(p.name) }}>
                                {getInitials(p.name)}
                            </div>
                            <h3>{p.name}</h3>
                            <div className="role-badge">
                                <p.icon size={12} />
                                <span>{p.role}</span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* All members */}
                <motion.h2 className="section-heading" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>Semua Siswa</motion.h2>
                <motion.div className="members-grid" variants={staggerContainer} initial="initial" whileInView="animate" viewport={{ once: true }}>
                    {allStudents.map((name, i) => {
                        const role = pengurus.find(p => p.name === name)
                        return (
                            <motion.div
                                key={i}
                                className="member-card glass-card"
                                variants={fadeInUp}
                                whileHover={{ scale: 1.08, y: -5, boxShadow: '0 8px 25px rgba(99,102,241,0.15)' }}
                                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                            >
                                <div className="member-avatar" style={{ background: `${hashColor(name)}15`, color: hashColor(name) }}>
                                    {getInitials(name)}
                                </div>
                                <h4>{name}</h4>
                                {role && <span className="mini-role">{role.role}</span>}
                                <span className="member-num">{i + 1}</span>
                            </motion.div>
                        )
                    })}
                </motion.div>
            </div>
        </PageTransition>
    )
}
