import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Phone, Mail, MapPin, User, MessageSquare } from 'lucide-react'
import PageTransition, { fadeInUp } from '../components/PageTransition'
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
                    <motion.div className="contact-info" initial="initial" animate="animate">
                        <h2>Info Kontak</h2>
                        <div className="contact-cards">
                            {contacts.map((c, i) => (
                                <motion.div
                                    key={i}
                                    className="contact-person glass-card"
                                    variants={fadeInUp}
                                    custom={i}
                                    whileHover={{ scale: 1.03, boxShadow: '0 0 20px rgba(99,102,241,0.15)' }}
                                >
                                    <div className="contact-avatar">
                                        <c.icon size={20} />
                                    </div>
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

                        <div className="contact-extra">
                            <div className="contact-item">
                                <Mail size={16} />
                                <span>xtkj3@smkpgriwlingi.sch.id</span>
                            </div>
                            <div className="contact-item">
                                <MapPin size={16} />
                                <span>SMK PGRI Wlingi — Kab. Blitar, Jawa Timur</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Form */}
                    <motion.form className="contact-form glass-card" onSubmit={handleSubmit} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                        <div className="form-header">
                            <img src="/logo-smk.png" alt="Logo" className="form-logo" />
                            <h2>Kirim Pesan</h2>
                        </div>
                        <div className="form-group">
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
                        </div>
                        <div className="form-group">
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
                        </div>
                        <div className="form-group">
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
                        </div>
                        <motion.button
                            type="submit"
                            className="btn-primary submit-btn"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Send size={16} />
                            {sent ? 'Pesan Terkirim! ✓' : 'Kirim Pesan'}
                        </motion.button>
                    </motion.form>
                </div>
            </div>
        </PageTransition>
    )
}
