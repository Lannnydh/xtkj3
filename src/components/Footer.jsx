import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import './Footer.css'

const footerLinks1 = [
    { to: '/announcements', label: 'Pengumuman' },
    { to: '/schedule', label: 'Jadwal' },
    { to: '/members', label: 'Anggota' },
    { to: '/gallery', label: 'Galeri' },
]

const footerLinks2 = [
    { to: '/tasks', label: 'Tugas' },
    { to: '/documents', label: 'Dokumen' },
    { to: '/achievements', label: 'Prestasi' },
    { to: '/contact', label: 'Kontak' },
]

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-inner">
                <motion.div
                    className="footer-brand"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="footer-logo">
                        <motion.img
                            src="/logo-smk.png"
                            alt="Logo"
                            className="footer-logo-img"
                            whileHover={{ rotate: 10, scale: 1.1 }}
                        />
                        <span>X TKJ 3</span>
                    </div>
                    <p className="footer-desc">Website resmi kelas X TKJ 3 — SMK PGRI Wlingi, Kab. Blitar. Tempat informasi, kolaborasi, dan dokumentasi kegiatan kelas.</p>
                </motion.div>
                <motion.div
                    className="footer-links"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                >
                    <h4>Navigasi</h4>
                    {footerLinks1.map((l, i) => (
                        <motion.div key={l.to} whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
                            <Link to={l.to}>{l.label}</Link>
                        </motion.div>
                    ))}
                </motion.div>
                <motion.div
                    className="footer-links"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <h4>Lainnya</h4>
                    {footerLinks2.map((l, i) => (
                        <motion.div key={l.to} whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
                            <Link to={l.to}>{l.label}</Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
            <motion.div
                className="footer-bottom"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <p>© 2026 Kelas X TKJ 3 — SMK PGRI Wlingi — Dibuat dengan <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}><Heart size={14} className="heart-icon" /></motion.span> oleh siswa TKJ 3</p>
            </motion.div>
        </footer>
    )
}
