import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Camera } from 'lucide-react'
import PageTransition, { staggerContainer, fadeInUp } from '../components/PageTransition'
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
                <h1 className="page-title">Galeri</h1>
                <p className="page-subtitle">Momen-momen berharga kelas X TKJ 3</p>

                <div className="gallery-filters">
                    {categories.map(c => (
                        <button
                            key={c}
                            className={`chip ${filter === c ? 'active' : ''}`}
                            onClick={() => setFilter(c)}
                        >
                            {c}
                        </button>
                    ))}
                </div>

                <motion.div className="masonry-grid" variants={staggerContainer} initial="initial" animate="animate" key={filter}>
                    {filtered.map((item) => (
                        <motion.div
                            key={item.id}
                            className="masonry-item"
                            variants={fadeInUp}
                            layout
                            whileHover={{ scale: 1.03 }}
                            onClick={() => setLightbox(item)}
                            style={{ height: item.h }}
                        >
                            <div className="masonry-placeholder" style={{ background: `linear-gradient(135deg, ${item.color}30, ${item.color}10)`, borderColor: `${item.color}30` }}>
                                <Camera size={32} style={{ color: item.color, opacity: 0.5 }} />
                            </div>
                            <div className="masonry-overlay">
                                <span className="masonry-cat">{item.cat}</span>
                                <h3>{item.title}</h3>
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
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                onClick={e => e.stopPropagation()}
                            >
                                <button className="lightbox-close" onClick={() => setLightbox(null)}><X size={20} /></button>
                                <div className="lightbox-img" style={{ background: `linear-gradient(135deg, ${lightbox.color}30, ${lightbox.color}10)`, height: 400 }}>
                                    <Camera size={64} style={{ color: lightbox.color, opacity: 0.4 }} />
                                </div>
                                <div className="lightbox-info">
                                    <span className="masonry-cat">{lightbox.cat}</span>
                                    <h2>{lightbox.title}</h2>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </PageTransition>
    )
}
