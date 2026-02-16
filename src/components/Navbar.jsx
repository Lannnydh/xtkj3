import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import './Navbar.css'

const navLinks = [
    { path: '/', label: 'Beranda' },
    { path: '/announcements', label: 'Pengumuman' },
    { path: '/schedule', label: 'Jadwal' },
    { path: '/members', label: 'Anggota' },
    { path: '/gallery', label: 'Galeri' },
    { path: '/confess', label: 'Curhat' },
    { path: '/tasks', label: 'Tugas' },
    { path: '/documents', label: 'Dokumen' },
    { path: '/achievements', label: 'Prestasi' },
    { path: '/contact', label: 'Kontak' },
]

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => { setIsOpen(false) }, [location])

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="nav-inner">
                <Link to="/" className="nav-logo">
                    <motion.img
                        src="/logo-smk.png"
                        alt="Logo SMK PGRI Wlingi"
                        className="logo-img"
                        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                    />
                    <div className="logo-text">
                        <span className="logo-title">SMK PGRI WLINGI</span>
                        <span className="logo-sub">X TKJ 3</span>
                    </div>
                </Link>

                <div className="nav-links-desktop">
                    {navLinks.map(l => (
                        <Link
                            key={l.path}
                            to={l.path}
                            className={`nav-link ${location.pathname === l.path ? 'active' : ''}`}
                        >
                            {l.label}
                            {location.pathname === l.path && (
                                <motion.div layoutId="nav-indicator" className="nav-indicator" />
                            )}
                        </Link>
                    ))}
                </div>

                <div className="nav-actions">
                    <ThemeToggle />
                    <button className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
                        <AnimatePresence mode="wait">
                            {isOpen ? (
                                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                    <X size={22} />
                                </motion.div>
                            ) : (
                                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                    <Menu size={22} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="nav-mobile"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {navLinks.map((l, i) => (
                            <motion.div
                                key={l.path}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.04, type: 'spring', stiffness: 300 }}
                            >
                                <Link
                                    to={l.path}
                                    className={`nav-mobile-link ${location.pathname === l.path ? 'active' : ''}`}
                                >
                                    {l.label}
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
