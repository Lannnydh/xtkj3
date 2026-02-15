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
                <h1 className="page-title">Dokumen</h1>
                <p className="page-subtitle">File dan dokumen penting kelas X TKJ 3</p>

                <motion.div className="docs-list" variants={staggerContainer} initial="initial" animate="animate">
                    {docs.map(d => (
                        <motion.div key={d.id} className="doc-card glass-card" variants={fadeInUp}>
                            <div className="doc-icon" style={{ background: `${d.color}15`, color: d.color }}>
                                <d.icon size={28} />
                            </div>
                            <div className="doc-info">
                                <h3>{d.name}</h3>
                                <p>{d.desc}</p>
                                <div className="doc-meta">
                                    <span className="doc-type">{d.type}</span>
                                    <span>{d.size}</span>
                                </div>
                            </div>
                            <button className="btn-outline doc-download">
                                <Download size={16} />
                                <span>Unduh</span>
                            </button>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </PageTransition>
    )
}
