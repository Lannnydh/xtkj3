import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, File, FileSpreadsheet, Loader, ExternalLink } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import PageTransition, { staggerContainer, fadeInUp } from '../components/PageTransition'
import './Documents.css'

export default function Documents() {
    const [documents, setDocuments] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const { data, error } = await supabase
                    .from('dokumen')
                    .select('*')
                    .order('created_at', { ascending: false })

                if (error) throw error
                setDocuments(data)
            } catch (error) {
                console.error('Error fetching documents:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchDocuments()
    }, [])

    const getIcon = (type) => {
        switch (type) {
            case 'PDF': return FileText
            case 'XLSX': return FileSpreadsheet
            default: return File
        }
    }

    const getColor = (type) => {
        switch (type) {
            case 'PDF': return '#ef4444'
            case 'XLSX': return '#10b981'
            case 'DOCX': return '#3b82f6'
            case 'PPT': return '#f59e0b'
            default: return '#8b5cf6'
        }
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '16px' }}>
                <Loader className="spin text-primary" size={40} />
                <p>Memuat dokumen...</p>
            </div>
        )
    }

    return (
        <PageTransition>
            <div className="page-container">
                <motion.h1 className="page-title" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>Dokumen / File Kelas</motion.h1>
                <motion.p className="page-subtitle" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>Daftar file penting, laporan kas, dan struktur kelas X TKJ 3</motion.p>

                {documents.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                        <p>Belum ada dokumen yang dibagikan.</p>
                    </div>
                ) : (
                    <motion.div className="docs-list" variants={staggerContainer} initial="initial" animate="animate">
                        {documents.map((d) => {
                            const Icon = getIcon(d.tipe)
                            const color = getColor(d.tipe)
                            return (
                                <motion.div
                                    key={d.id}
                                    className="doc-card glass-card"
                                    variants={fadeInUp}
                                    whileHover={{ scale: 1.02, x: 8, boxShadow: '0 8px 30px rgba(99,102,241,0.1)' }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    <motion.div
                                        className="doc-icon"
                                        style={{ background: `${color}15`, color: color }}
                                        whileHover={{ rotate: 15, scale: 1.15 }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                    >
                                        <Icon size={28} />
                                    </motion.div>
                                    <div className="doc-info">
                                        <h3>{d.nama_file}</h3>
                                        <p>{d.deskripsi}</p>
                                        <div className="doc-meta">
                                            <span className="doc-type">{d.tipe}</span>
                                        </div>
                                    </div>
                                    <motion.a
                                        href={d.url_dokumen}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-outline doc-download"
                                        whileHover={{ scale: 1.08, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
                                    >
                                        <motion.div
                                            whileHover={{ y: [0, -3, 0] }}
                                            transition={{ duration: 0.5, repeat: Infinity }}
                                        >
                                            <ExternalLink size={16} />
                                        </motion.div>
                                        <span>Buka Link</span>
                                    </motion.a>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                )}
            </div>
        </PageTransition>
    )
}
