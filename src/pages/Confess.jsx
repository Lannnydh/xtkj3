import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MessageCircle, AlertCircle, ExternalLink, Ghost, Sparkles, MessageSquare } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import { supabase } from '../lib/supabaseClient'
import './Confess.css'

const nglLink = "https://ngl.link/xtkj358421"

export default function Confess() {
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [sender, setSender] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)

    // Fetch messages from Supabase
    useEffect(() => {
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('confess')
                .select('*')
                .eq('status', 'approved') // Only show approved confessions
                .order('created_at', { ascending: false })

            if (data) setMessages(data)
            if (error) console.error('Error fetching confessions:', error)
        }

        fetchMessages()

        // Realtime subscription for approved messages
        const subscription = supabase
            .channel('confess_wall')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'confess' }, fetchMessages)
            .subscribe()

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        setIsSubmitting(true)
        setSubmitSuccess(false)

        const { error } = await supabase
            .from('confess')
            .insert([{
                pengirim: sender || 'Anonim',
                pesan: newMessage,
                // status is 'pending' by default in DB
            }])

        if (error) {
            alert('Gagal mengirim pesan: ' + error.message)
        } else {
            setNewMessage('')
            setSender('')
            setSubmitSuccess(true)
            setTimeout(() => setSubmitSuccess(false), 5000)
        }

        setIsSubmitting(false)
    }

    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const messageDate = new Date(timestamp);
        const diffInSeconds = Math.floor((now - messageDate) / 1000);

        if (diffInSeconds < 60) return 'Baru saja';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lalu`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
        return `${Math.floor(diffInSeconds / 86400)} hari lalu`;
    };

    return (
        <PageTransition>
            <div className="page-container confess-container">
                <motion.div className="confess-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="page-title">Kotak Curhat</h1>
                    <p className="page-subtitle">Sampaikan isi hatimu, secara rahasia atau terang-terangan.</p>
                </motion.div>

                <div className="confess-grid">
                    {/* Left Column: Input Forms */}
                    <div className="confess-inputs">
                        {/* NGL Section */}
                        <motion.div
                            className="confess-card glass-card secret-card"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                            whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(99,102,241,0.15)' }}
                        >
                            <div className="card-header">
                                <motion.div animate={{ y: [0, -5, 0], rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                                    <Ghost className="ngl-icon" size={24} />
                                </motion.div>
                                <h2>Rahasia (Privat)</h2>
                            </div>
                            <p>Kirim pesan anonim langsung ke admin via NGL. Tidak akan muncul di sini.</p>
                            <motion.a
                                href={nglLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-ngl"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Kirim via NGL <ExternalLink size={16} />
                            </motion.a>
                        </motion.div>

                        {/* Public Wall Form */}
                        <motion.div
                            className="confess-card glass-card wall-form-card"
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        >
                            <div className="card-header">
                                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                                    <MessageCircle className="wall-icon" size={24} />
                                </motion.div>
                                <h2>Dinding Kelas (Publik)</h2>
                            </div>
                            <p className="rules-text">
                                <AlertCircle size={14} /> 
                                Gunakan bahasa yang sopan. Pesanmu akan direview oleh admin sebelum tampil.
                            </p>

                            <form onSubmit={handleSubmit} className="wall-form">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Nama / Inisial (Opsional)"
                                        value={sender}
                                        onChange={e => setSender(e.target.value)}
                                        className="confess-input"
                                    />
                                </div>
                                <textarea
                                    placeholder="Tulis pesanmu di sini..."
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    className="confess-textarea"
                                    required
                                    rows="4"
                                ></textarea>
                                
                                {submitSuccess && (
                                    <div style={{ color: 'var(--success)', fontSize: '0.9rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Sparkles size={16} /> Pesan terkirim! Menunggu approval admin.
                                    </div>
                                )}

                                <motion.button
                                    type="submit"
                                    className="btn-primary btn-submit"
                                    disabled={isSubmitting}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '14px' }}
                                >
                                    {isSubmitting ? 'Mengirim...' : <><Send size={18} /> Kirim ke Dinding</>}
                                </motion.button>
                            </form>
                        </motion.div>
                    </div>

                    {/* Right Column: Message Wall */}
                    <div className="confess-wall">
                        <motion.h3
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="wall-title"
                        >
                            <motion.span animate={{ rotate: [0, 20, -20, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                                <Sparkles size={18} />
                            </motion.span>
                            Pesan Terpilih
                        </motion.h3>

                        <div className="messages-list">
                            {messages.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Belum ada pesan yang disetujui.</div>
                            ) : (
                                <AnimatePresence>
                                    {messages.map((msg, i) => (
                                        <motion.div
                                            key={msg.id}
                                            className="message-card glass-card"
                                            initial={{ opacity: 0, scale: 0.85, y: 30, rotateX: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                                            exit={{ opacity: 0, scale: 0.85, x: -50 }}
                                            transition={{ delay: i * 0.04, type: 'spring', stiffness: 200 }}
                                            whileHover={{ scale: 1.02, y: -3 }}
                                            layout
                                        >
                                            <div className="msg-header" style={{ marginBottom: '12px' }}>
                                                <span className="msg-sender" style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>{msg.pengirim}</span>
                                                <span className="msg-date" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatTimeAgo(msg.created_at)}</span>
                                            </div>
                                            <p className="msg-content" style={{ fontSize: '1.05rem', lineHeight: '1.5' }}>{msg.pesan}</p>
                                            
                                            {msg.balasan && (
                                                <div style={{ marginTop: '16px', background: 'rgba(99,102,241,0.05)', borderLeft: '3px solid var(--accent-primary)', padding: '12px 16px', borderRadius: '4px 8px 8px 4px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 600 }}>
                                                        <MessageSquare size={14} /> Admin Reply
                                                    </div>
                                                    <p style={{ margin: 0, fontSize: '0.95rem' }}>{msg.balasan}</p>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    )
}
