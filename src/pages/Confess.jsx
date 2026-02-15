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
            color: '#8b5cf6', // Bisa dirandomize kalau mau
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
            // Pesan akan muncul otomatis karena subscription
        }

        setIsSubmitting(false)
    }

    const handleLike = async (id, currentLikes) => {
        // Optimistic update
        setMessages(prev => prev.map(m => m.id === id ? { ...m, likes: m.likes + 1 } : m))

        const { error } = await supabase
            .from('confessions')
            .update({ likes: currentLikes + 1 })
            .eq('id', id)

        if (error) {
            console.error('Error liking message:', error)
            // Revert optimistic update if error
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
                        <div className="confess-card glass-card secret-card">
                            <div className="card-header">
                                <Ghost className="ngl-icon" size={24} />
                                <h2>Rahasia (Privat)</h2>
                            </div>
                            <p>Kirim pesan anonim langsung ke admin. Tidak akan muncul di sini.</p>
                            <a href={nglLink} target="_blank" rel="noopener noreferrer" className="btn-ngl">
                                Kirim via NGL <ExternalLink size={16} />
                            </a>
                        </div>

                        {/* Public Wall Form */}
                        <motion.div
                            className="confess-card glass-card wall-form-card"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="card-header">
                                <MessageCircle className="wall-icon" size={24} />
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
                                <button type="submit" className="btn-primary btn-submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Mengirim...' : <><Send size={18} /> Kirim ke Dinding</>}
                                </button>
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
                            <Sparkles size={18} /> Pesan Terbaru
                        </motion.h3>

                        <div className="messages-list">
                            <AnimatePresence>
                                {messages.map((msg, i) => (
                                    <motion.div
                                        key={msg.id}
                                        className="message-card glass-card"
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: i * 0.05 }}
                                        layout
                                    >
                                        <div className="msg-header">
                                            <span className="msg-sender" style={{ color: msg.color }}>{msg.name}</span>
                                            <span className={`msg-tag tag-${msg.tag.toLowerCase()}`}>{msg.tag}</span>
                                        </div>
                                        <p className="msg-content">{msg.message}</p>
                                        <div className="msg-footer">
                                            <span className="msg-date">{new Date(msg.created_at).toLocaleDateString()}</span>
                                            <button className="btn-like" onClick={() => handleLike(msg.id, msg.likes)}>
                                                <Heart size={14} /> {msg.likes}
                                            </button>
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
