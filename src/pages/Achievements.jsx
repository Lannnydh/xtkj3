import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Award, Calendar, Loader } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import PageTransition, { staggerContainer, fadeInUp } from '../components/PageTransition'
import './Achievements.css'

export default function Achievements() {
    const [achievements, setAchievements] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const { data, error } = await supabase
                    .from('prestasi')
                    .select('*')
                    .order('created_at', { ascending: false })

                if (error) throw error
                setAchievements(data)
            } catch (error) {
                console.error('Error fetching achievements:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchAchievements()
    }, [])

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '16px' }}>
                <Loader className="spin text-primary" size={40} />
                <p>Memuat prestasi kelas...</p>
            </div>
        )
    }

    return (
        <PageTransition>
            <div className="page-container">
                <motion.h1 className="page-title" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>Prestasi Kelas</motion.h1>
                <motion.p className="page-subtitle" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>Piala, medali, dan penghargaan X TKJ 3</motion.p>

                {achievements.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                        <p>Belum ada prestasi yang dicatat. Mari cetak sejarah baru!</p>
                    </div>
                ) : (
                    <motion.div className="timeline-container" variants={staggerContainer} initial="initial" animate="animate">
                        {achievements.map((item, index) => (
                            <motion.div
                                key={item.id}
                                className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
                                variants={fadeInUp}
                                viewport={{ once: true, margin: '-50px' }}
                            >
                                <div className="timeline-dot">
                                    <Award size={20} />
                                </div>

                                <motion.div
                                    className="timeline-content glass-card"
                                    whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(99,102,241,0.15)' }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    {item.image_url && (
                                        <div className="timeline-img-wrapper">
                                            <img src={item.image_url} alt={item.judul} />
                                        </div>
                                    )}
                                    <div className="timeline-text">
                                        <div className="timeline-date">
                                            <Calendar size={14} />
                                            <span>{item.tanggal || 'Waktu tidak diketahui'}</span>
                                        </div>
                                        <h3>{item.judul}</h3>
                                        <p>{item.deskripsi}</p>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </PageTransition>
    )
}
