import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Heart, MessageCircle, AlertCircle, ExternalLink, Ghost, Sparkles } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import { supabase } from '../lib/supabaseClient'
import './Confess.css'

const nglLink = "https://ngl.link/xtkj358421"


export default function Confess() {
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [sender, setSender] = useState('')
    const [tag, setTag] = useState('Curhat')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Fetch messages from Supabase
    useEffect(() => {
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('confessions')
                .select('*')
                .order('created_at', { ascending: false })

            if (data) setMessages(data)
            if (error) console.error('Error fetching confessions:', error)
        }

        fetchMessages()

        // Realtime subscription (Auto update)
        const subscription = supabase
            .channel('confessions')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'confessions' }, payload => {
                setMessages(prev => [payload.new, ...prev])
            })
            .subscribe()

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        setIsSubmitting(true)

        const newMsg = {
            name: sender || 'Anonim',
            message: newMessage,
            tag: tag,
            color: '#8b5cf6',
            likes: 0
        }

        const { error } = await supabase
            .from('confessions')
            .insert([newMsg])

        if (error) {
            alert('Gagal mengirim pesan: ' + error.message)
        } else {
            setNewMessage('')
            setSender('')
        }

        setIsSubmitting(false)
    }

    const handleLike = async (id, currentLikes) => {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, likes: m.likes + 1 } : m))

        const { error } = await supabase
            .from('confessions')
            .update({ likes: currentLikes + 1 })
            .eq('id', id)

        if (error) {
            console.error('Error liking message:', error)
            setMessages(prev => prev.map(m => m.id === id ? { ...m, likes: m.likes - 1 } : m))
        }
    }

    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const messageDate = new Date(timestamp);
        const diffInSeconds = Math.floor((now - messageDate) / 1000);

        if (diffInSeconds < 60) {
            return 'Baru saja';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} menit lalu`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} jam lalu`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} hari lalu`;
        }
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
                                <motion.div
                                    animate={{ y: [0, -5, 0], rotate: [0, 5, -5, 0] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                >
                                    <Ghost className="ngl-icon" size={24} />
                                </motion.div>
                                <h2>Rahasia (Privat)</h2>
                            </div>
                            <p>Kirim pesan anonim langsung ke admin. Tidak akan muncul di sini.</p>
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
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <MessageCircle className="wall-icon" size={24} />
                                </motion.div>
                                <h2>Dinding Kelas (Publik)</h2>
                            </div>
                            <p className="rules-text"><AlertCircle size={14} /> Gunakan bahasa yang sopan. No SARA/Bullying.</p>

                            <form onSubmit={handleSubmit} className="wall-form">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Nama / Inisial (Opsional)"
                                        value={sender}
                                        onChange={e => setSender(e.target.value)}
                                        className="confess-input"
                                    />
                                    <select
                                        value={tag}
                                        onChange={e => setTag(e.target.value)}
                                        className="confess-select"
                                    >
                                        <option value="Curhat">Curhat</option>
                                        <option value="Spill">Spill</option>
                                        <option value="Motivasi">Motivasi</option>
                                        <option value="Info">Info Penting</option>
                                        <option value="Gombal">Gombal</option>
                                    </select>
                                </div>
                                <textarea
                                    placeholder="Tulis pesanmu di sini..."
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    className="confess-textarea"
                                    required
                                    rows="4"
                                ></textarea>
                                <motion.button
                                    type="submit"
                                    className="btn-primary btn-submit"
                                    disabled={isSubmitting}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
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
                            Pesan Terbaru
                        </motion.h3>

                        <div className="messages-list">
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
                                        <div className="msg-header">
                                            <span className="msg-sender" style={{ color: msg.color }}>{msg.name}</span>
                                            <motion.span
                                                className={`msg-tag tag-${msg.tag?.toLowerCase()}`}
                                                whileHover={{ scale: 1.1 }}
                                            >
                                                {msg.tag}
                                            </motion.span>
                                        </div>
                                        <p className="msg-content">{msg.message}</p>
                                        <div className="msg-footer">
                                            <span className="msg-date">{formatTimeAgo(msg.created_at)}</span>
                                            <motion.button
                                                className="btn-like"
                                                onClick={() => handleLike(msg.id, msg.likes)}
                                                whileHover={{ scale: 1.2 }}
                                                whileTap={{ scale: 0.8 }}
                                            >
                                                <motion.div
                                                    whileTap={{ scale: [1, 1.5, 1], rotate: [0, -15, 15, 0] }}
                                                    transition={{ duration: 0.4 }}
                                                >
                                                    <Heart size={14} />
                                                </motion.div>
                                                {msg.likes}
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    )
}
