import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import './Footer.css'

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-inner">
                <div className="footer-brand">
                    <div className="footer-logo">
                        <img src="/logo-smk.png" alt="Logo" className="footer-logo-img" />
                        <span>X TKJ 3</span>
                    </div>
                    <p className="footer-desc">Website resmi kelas X TKJ 3 — SMK PGRI Wlingi, Kab. Blitar. Tempat informasi, kolaborasi, dan dokumentasi kegiatan kelas.</p>
                </div>
                <div className="footer-links">
                    <h4>Navigasi</h4>
                    <Link to="/announcements">Pengumuman</Link>
                    <Link to="/schedule">Jadwal</Link>
                    <Link to="/members">Anggota</Link>
                    <Link to="/gallery">Galeri</Link>
                </div>
                <div className="footer-links">
                    <h4>Lainnya</h4>
                    <Link to="/tasks">Tugas</Link>
                    <Link to="/documents">Dokumen</Link>
                    <Link to="/achievements">Prestasi</Link>
                    <Link to="/contact">Kontak</Link>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© 2026 Kelas X TKJ 3 — SMK PGRI Wlingi — Dibuat dengan <Heart size={14} className="heart-icon" /> oleh siswa TKJ 3</p>
            </div>
        </footer>
    )
}
