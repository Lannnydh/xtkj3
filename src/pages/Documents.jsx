import { motion } from 'framer-motion'
import { FileText, Download, File, FileSpreadsheet } from 'lucide-react'
import PageTransition, { staggerContainer, fadeInUp } from '../components/PageTransition'
import './Documents.css'

const docs = [
    { id: 1, name: 'Struktur Organisasi Kelas', type: 'PDF', size: '2.4 MB', icon: FileText, color: '#ef4444', desc: 'Bagan struktur pengurus kelas X TKJ 3 tahun ajaran 2025/2026' },
    { id: 2, name: 'Aturan Kelas X TKJ 3', type: 'PDF', size: '1.1 MB', icon: FileText, color: '#ef4444', desc: 'Peraturan dan tata tertib yang disepakati bersama' },
    { id: 3, name: 'Template Surat Izin', type: 'DOCX', size: '340 KB', icon: File, color: '#3b82f6', desc: 'Template surat izin sakit, kegiatan, dan dispensasi' },
    { id: 4, name: 'Notulen Rapat Kelas - Januari', type: 'DOCX', size: '520 KB', icon: File, color: '#3b82f6', desc: 'Hasil rapat evaluasi bulan Januari 2026' },
    { id: 5, name: 'Notulen Rapat Kelas - Februari', type: 'DOCX', size: '480 KB', icon: File, color: '#3b82f6', desc: 'Hasil rapat perencanaan kegiatan bulan Februari' },
    { id: 6, name: 'Rekap Kas Kelas', type: 'XLSX', size: '780 KB', icon: FileSpreadsheet, color: '#10b981', desc: 'Laporan keuangan dan pengeluaran kas kelas' },
    { id: 7, name: 'Jadwal Piket Semester 2', type: 'PDF', size: '1.5 MB', icon: FileText, color: '#ef4444', desc: 'Pembagian jadwal piket semester genap' },
    { id: 8, name: 'Daftar Hadir Siswa', type: 'XLSX', size: '620 KB', icon: FileSpreadsheet, color: '#10b981', desc: 'Rekapitulasi kehadiran siswa per bulan' },
]

export default function Documents() {
    return (
        <PageTransition>
            <div className="page-container">
                <motion.h1 className="page-title" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>Dokumen</motion.h1>
                <motion.p className="page-subtitle" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>File dan dokumen penting kelas X TKJ 3</motion.p>

                <motion.div className="docs-list" variants={staggerContainer} initial="initial" animate="animate">
                    {docs.map((d, i) => (
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
                                style={{ background: `${d.color}15`, color: d.color }}
                                whileHover={{ rotate: 15, scale: 1.15 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <d.icon size={28} />
                            </motion.div>
                            <div className="doc-info">
                                <h3>{d.name}</h3>
                                <p>{d.desc}</p>
                                <div className="doc-meta">
                                    <span className="doc-type">{d.type}</span>
                                    <span>{d.size}</span>
                                </div>
                            </div>
                            <motion.button
                                className="btn-outline doc-download"
                                whileHover={{ scale: 1.08, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <motion.div
                                    whileHover={{ y: [0, 3, 0] }}
                                    transition={{ duration: 0.5, repeat: Infinity }}
                                >
                                    <Download size={16} />
                                </motion.div>
                                <span>Unduh</span>
                            </motion.button>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </PageTransition>
    )
}
