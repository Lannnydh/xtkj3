import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Phone, Mail, MapPin, User, MessageSquare, CheckCircle } from 'lucide-react'
import PageTransition, { fadeInUp, staggerContainer } from '../components/PageTransition'
import './Contact.css'

const contacts = [
    { name: 'Heven Jovanska Bertha Satria', role: 'Ketua Kelas', phone: '08xx-xxxx-xxxx', icon: User },
    { name: 'Keand Gandung Permana', role: 'Wakil Ketua', phone: '08xx-xxxx-xxxx', icon: User },
    { name: 'Syahfira Yaumi Khoirun Annisa, S.Pd', role: 'Wali Kelas', phone: '08xx-xxxx-xxxx', icon: User },
]

export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', message: '' })
    const [sent, setSent] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        setSent(true)
        setTimeout(() => setSent(false), 3000)
        setForm({ name: '', email: '', message: '' })
    }

    return (
        <PageTransition>
            <div className="page-container">
                <motion.h1 className="page-title" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>Kontak</motion.h1>
                <motion.p className="page-subtitle" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>Punya pertanyaan? Hubungi kami — SMK PGRI Wlingi</motion.p>

                <div className="contact-grid">
                    {/* Contact Cards */}
                    <motion.div
                        className="contact-info"
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                    >
                        <motion.h2 variants={fadeInUp}>Info Kontak</motion.h2>
                        <div className="contact-cards">
                            {contacts.map((c, i) => (
                                <motion.div
                                    key={i}
                                    className="contact-person glass-card"
                                    variants={fadeInUp}
                                    custom={i}
                                    whileHover={{ scale: 1.03, x: 5, boxShadow: '0 8px 30px rgba(99,102,241,0.12)' }}
                                    whileTap={{ scale: 0.97 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    <motion.div
                                        className="contact-avatar"
                                        whileHover={{ rotate: 15, scale: 1.15 }}
                                        animate={{ y: [0, -2, 0] }}
                                        transition={{ duration: 2 + i * 0.5, repeat: Infinity }}
                                    >
                                        <c.icon size={20} />
                                    </motion.div>
                                    <div>
                                        <h3>{c.name}</h3>
                                        <span className="contact-role">{c.role}</span>
                                        <div className="contact-detail">
                                            <Phone size={12} />
                                            <span>{c.phone}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div className="contact-extra" variants={fadeInUp}>
                            <motion.div className="contact-item" whileHover={{ x: 5 }}>
                                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                                    <Mail size={16} />
                                </motion.div>
                                <span>xtkj3@smkpgriwlingi.sch.id</span>
                            </motion.div>
                            <motion.div className="contact-item" whileHover={{ x: 5 }}>
                                <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                                    <MapPin size={16} />
                                </motion.div>
                                <span>SMK PGRI Wlingi — Kab. Blitar, Jawa Timur</span>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Form */}
                    <motion.form
                        className="contact-form glass-card"
                        onSubmit={handleSubmit}
                        initial={{ opacity: 0, x: 30, rotateY: 5 }}
                        animate={{ opacity: 1, x: 0, rotateY: 0 }}
                        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                    >
                        <div className="form-header">
                            <motion.img
                                src="/logo-smk.png"
                                alt="Logo"
                                className="form-logo"
                                whileHover={{ rotate: 10, scale: 1.1 }}
                            />
                            <h2>Kirim Pesan</h2>
                        </div>
                        <motion.div className="form-group" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                            <label>Nama</label>
                            <div className="input-wrap">
                                <User size={16} />
                                <input
                                    type="text"
                                    placeholder="Nama lengkap"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                            </div>
                        </motion.div>
                        <motion.div className="form-group" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                            <label>Email</label>
                            <div className="input-wrap">
                                <Mail size={16} />
                                <input
                                    type="email"
                                    placeholder="email@contoh.com"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    required
                                />
                            </div>
                        </motion.div>
                        <motion.div className="form-group" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                            <label>Pesan</label>
                            <div className="input-wrap textarea-wrap">
                                <MessageSquare size={16} />
                                <textarea
                                    placeholder="Tulis pesan kamu..."
                                    rows={5}
                                    value={form.message}
                                    onChange={e => setForm({ ...form, message: e.target.value })}
                                    required
                                />
                            </div>
                        </motion.div>
                        <motion.button
                            type="submit"
                            className="btn-primary submit-btn"
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            {sent ? <><CheckCircle size={16} /> Pesan Terkirim! ✓</> : <><Send size={16} /> Kirim Pesan</>}
                        </motion.button>
                    </motion.form>
                </div>
            </div>
        </PageTransition>
    )
}
