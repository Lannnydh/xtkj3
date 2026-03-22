import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Instagram, MapPin, Mail, Phone, Loader, MessageCircle } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import PageTransition, { staggerContainer, fadeInUp, scaleIn } from '../components/PageTransition'
import './Contact.css'

export default function Contact() {
    const [contacts, setContacts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const { data, error } = await supabase
                    .from('kontak')
                    .select('*')
                    .order('created_at', { ascending: false })

                if (error) throw error
                setContacts(data)
            } catch (error) {
                console.error('Error fetching contacts:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchContacts()
    }, [])

    const getIcon = (platform) => {
        const p = platform.toLowerCase()
        if (p.includes('instagram') || p.includes('ig')) return Instagram
        if (p.includes('whatsapp') || p.includes('wa')) return MessageCircle
        if (p.includes('email') || p.includes('mail')) return Mail
        if (p.includes('tiktok') || p.includes('youtube')) return Phone // fallback generic
        return MapPin
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '16px' }}>
                <Loader className="spin text-primary" size={40} />
                <p>Memuat informasi kontak...</p>
            </div>
        )
    }

    return (
        <PageTransition>
            <div className="page-container">
                <motion.h1 className="page-title" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>Hubungi Kami</motion.h1>
                <motion.p className="page-subtitle" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>Temukan kami di sosial media atau kunjungi kelas kami secara langsung.</motion.p>

                <div className="contact-grid">
                    {/* Maps / Offline Location */}
                    <motion.div
                        className="location-card glass-card"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                    >
                        <div className="card-header">
                            <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                                <MapPin size={24} className="text-secondary" />
                            </motion.div>
                            <h2>Lokasi Kelas</h2>
                        </div>
                        <div className="map-container">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15802.730302325608!2d112.31688536109312!3d-8.031542617300325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e78ead93cbe2fb3%3A0xe5a3c2605f15ca40!2sSMK%20PGRI%20Wlingi!5e0!3m2!1sid!2sid!4v1707284424361!5m2!1sid!2sid"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Map SMK PGRI Wlingi"
                            ></iframe>
                        </div>
                        <p className="address-text">
                            <strong>SMK PGRI Wlingi</strong><br />
                            Jl. Jenderal Sudirman No.86, Beru, Kec. Wlingi, Kabupaten Blitar, Jawa Timur 66136<br />
                            <em>Gedung Utama, Lantai 2, Ruang X TKJ 3</em>
                        </p>
                    </motion.div>

                    {/* Social Media Links from Supabase */}
                    <div className="social-links-container">
                        <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>Sosial Media & Email</motion.h3>
                        
                        {contacts.length === 0 ? (
                            <div style={{ padding: '20px', color: 'var(--text-muted)' }}>Belum ada link kontak yang ditambahkan.</div>
                        ) : (
                            <motion.div className="social-grid" variants={staggerContainer} initial="initial" animate="animate">
                                {contacts.map(contact => {
                                    const Icon = getIcon(contact.platform)
                                    return (
                                        <motion.a
                                            key={contact.id}
                                            href={contact.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="social-card glass-card"
                                            variants={scaleIn}
                                            whileHover={{ scale: 1.05, y: -5, boxShadow: '0 10px 40px rgba(99,102,241,0.2)' }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <div className="social-icon">
                                                <Icon size={24} />
                                            </div>
                                            <div className="social-info">
                                                <h4>{contact.platform}</h4>
                                                <span>{contact.username}</span>
                                            </div>
                                        </motion.a>
                                    )
                                })}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </PageTransition>
    )
}
