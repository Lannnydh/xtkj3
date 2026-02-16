import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Camera, ZoomIn } from 'lucide-react'
import PageTransition, { staggerContainer, fadeInUp, scaleIn } from '../components/PageTransition'
import './Gallery.css'

const categories = ['Semua', 'Classmeeting', 'Study Tour', 'Event OSIS', 'Hari Guru', 'Kegiatan Kelas']

const galleryItems = [
    { id: 1, title: 'Classmeeting Basket Final', cat: 'Classmeeting', color: '#6366f1', h: 280 },
    { id: 2, title: 'Study Tour Bandung', cat: 'Study Tour', color: '#8b5cf6', h: 340 },
    { id: 3, title: 'Upacara Hari Guru', cat: 'Hari Guru', color: '#f59e0b', h: 240 },
    { id: 4, title: 'Lomba Debat OSIS', cat: 'Event OSIS', color: '#10b981', h: 300 },
    { id: 5, title: 'Foto Kelas Semester 1', cat: 'Kegiatan Kelas', color: '#ec4899', h: 260 },
    { id: 6, title: 'Classmeeting Futsal', cat: 'Classmeeting', color: '#3b82f6', h: 320 },
    { id: 7, title: 'Kunjungan Industri', cat: 'Study Tour', color: '#14b8a6', h: 280 },
    { id: 8, title: 'Pentas Seni Hari Guru', cat: 'Hari Guru', color: '#f97316', h: 350 },
    { id: 9, title: 'Rapat OSIS Gabungan', cat: 'Event OSIS', color: '#a855f7', h: 240 },
    { id: 10, title: 'Gotong Royong Kelas', cat: 'Kegiatan Kelas', color: '#6366f1', h: 290 },
    { id: 11, title: 'Classmeeting Voli', cat: 'Classmeeting', color: '#ef4444', h: 270 },
    { id: 12, title: 'Wisata Edukasi Museum', cat: 'Study Tour', color: '#8b5cf6', h: 310 },
]

export default function Gallery() {
    const [filter, setFilter] = useState('Semua')
    const [lightbox, setLightbox] = useState(null)

    const filtered = filter === 'Semua' ? galleryItems : galleryItems.filter(g => g.cat === filter)

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

                <motion.div
                    className="gallery-filters"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {categories.map(c => (
                        <motion.button
                            key={c}
                            className={`chip ${filter === c ? 'active' : ''}`}
                            onClick={() => setFilter(c)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {c}
                        </motion.button>
                    ))}
                </motion.div>

                <motion.div className="masonry-grid" variants={staggerContainer} initial="initial" animate="animate" key={filter}>
                    {filtered.map((item) => (
                        <motion.div
                            key={item.id}
                            className="masonry-item"
                            variants={scaleIn}
                            layout
                            whileHover={{ scale: 1.03, y: -5 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setLightbox(item)}
                            style={{ height: item.h }}
                        >
                            <div className="masonry-placeholder" style={{ background: `linear-gradient(135deg, ${item.color}30, ${item.color}10)`, borderColor: `${item.color}30` }}>
                                <motion.div
                                    animate={{ y: [0, -5, 0], rotate: [0, 5, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    <Camera size={32} style={{ color: item.color, opacity: 0.5 }} />
                                </motion.div>
                            </div>
                            <div className="masonry-overlay">
                                <span className="masonry-cat">{item.cat}</span>
                                <h3>{item.title}</h3>
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
                            >
                                <motion.button
                                    className="lightbox-close"
                                    onClick={() => setLightbox(null)}
                                    whileHover={{ rotate: 90, scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <X size={20} />
                                </motion.button>
                                <div className="lightbox-img" style={{ background: `linear-gradient(135deg, ${lightbox.color}30, ${lightbox.color}10)`, height: 400 }}>
                                    <motion.div
                                        animate={{ scale: [1, 1.05, 1], rotate: [0, 3, -3, 0] }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                    >
                                        <Camera size={64} style={{ color: lightbox.color, opacity: 0.4 }} />
                                    </motion.div>
                                </div>
                                <motion.div
                                    className="lightbox-info"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <span className="masonry-cat">{lightbox.cat}</span>
                                    <h2>{lightbox.title}</h2>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </PageTransition>
    )
}
