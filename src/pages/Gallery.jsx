import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn, Loader } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import PageTransition, { staggerContainer, scaleIn } from '../components/PageTransition'
import './Gallery.css'

export default function Gallery() {
    const [gallery, setGallery] = useState([])
    const [loading, setLoading] = useState(true)
    const [lightbox, setLightbox] = useState(null)

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const { data, error } = await supabase
                    .from('galeri')
                    .select('*')
                    .order('created_at', { ascending: false })

                if (error) throw error
                setGallery(data)
            } catch (error) {
                console.error('Error fetching gallery:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchGallery()
    }, [])

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '16px' }}>
                <Loader className="spin text-primary" size={40} />
                <p>Memuat galeri foto...</p>
            </div>
        )
    }

    return (
        <PageTransition>
            <div className="page-container">
                <motion.h1
                    className="page-title"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    Galeri
                </motion.h1>
                <motion.p
                    className="page-subtitle"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    Momen-momen berharga kelas X TKJ 3
                </motion.p>

                {gallery.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                        <p>Belum ada foto yang di-upload ke galeri.</p>
                    </div>
                ) : (
                    <motion.div className="masonry-grid" variants={staggerContainer} initial="initial" animate="animate">
                        {gallery.map((item) => (
                            <motion.div
                                key={item.id}
                                className="masonry-item"
                                variants={scaleIn}
                                layout
                                whileHover={{ scale: 1.03, y: -5 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setLightbox(item)}
                                style={{ height: 'auto', minHeight: '200px' }} // Let height adjust based on content
                            >
                                <img src={item.image_url} alt={item.caption} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                <div className="masonry-overlay">
                                    <h3 style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>{item.caption}</h3>
                                    <motion.div
                                        className="masonry-zoom"
                                        initial={{ opacity: 0, scale: 0 }}
                                        whileHover={{ opacity: 1, scale: 1 }}
                                    >
                                        <ZoomIn size={20} />
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                <AnimatePresence>
                    {lightbox && (
                        <motion.div
                            className="lightbox"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setLightbox(null)}
                        >
                            <motion.div
                                className="lightbox-content"
                                initial={{ scale: 0.7, opacity: 0, rotateX: 15 }}
                                animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                                exit={{ scale: 0.7, opacity: 0, rotateX: -15 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                onClick={e => e.stopPropagation()}
                                style={{ padding: 0, overflow: 'hidden', background: 'transparent' }}
                            >
                                <motion.button
                                    className="lightbox-close"
                                    onClick={() => setLightbox(null)}
                                    whileHover={{ rotate: 90, scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10, background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer' }}
                                >
                                    <X size={20} />
                                </motion.button>
                                <img src={lightbox.image_url} alt={lightbox.caption} style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', background: '#000' }} />
                                {lightbox.caption && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        style={{ background: 'var(--surface-1)', padding: '16px', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}
                                    >
                                        <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{lightbox.caption}</h2>
                                    </motion.div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </PageTransition>
    )
}
