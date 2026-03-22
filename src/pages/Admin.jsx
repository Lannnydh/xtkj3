import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, Calendar, Users, Megaphone, CheckSquare, LogOut, Loader, Home, UserCircle, Image as ImageIcon, MessageSquare, FolderOpen, Award, Phone } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import PageTransition from '../components/PageTransition'
import './Admin.css'

// Komponen admin akan kita buat secara terpisah dan di-import nanti, 
// sementara kita pakai div placeholder.
import AdminSchedule from './admin/AdminSchedule'
import AdminPiket from './admin/AdminPiket'
import AdminAnnouncements from './admin/AdminAnnouncements'
import AdminTasks from './admin/AdminTasks'
import AdminMembers from './admin/AdminMembers'
import AdminGallery from './admin/AdminGallery'
import AdminConfess from './admin/AdminConfess'
import AdminDocuments from './admin/AdminDocuments'
import AdminAchievements from './admin/AdminAchievements'
import AdminContact from './admin/AdminContact'

const tabs = [
    { id: 'jadwal', label: 'Jadwal Kelas', icon: Calendar },
    { id: 'piket', label: 'Jadwal Piket', icon: Users },
    { id: 'pengumuman', label: 'Pengumuman', icon: Megaphone },
    { id: 'tugas', label: 'Tugas', icon: CheckSquare },
    { id: 'anggota', label: 'Anggota', icon: UserCircle },
    { id: 'galeri', label: 'Galeri', icon: ImageIcon },
    { id: 'confess', label: 'Confess', icon: MessageSquare },
    { id: 'dokumen', label: 'Dokumen', icon: FolderOpen },
    { id: 'prestasi', label: 'Prestasi', icon: Award },
    { id: 'kontak', label: 'Kontak', icon: Phone },
]

export default function Admin() {
    const [activeTab, setActiveTab] = useState('jadwal')
    const { user, signOut } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        await signOut()
        navigate('/login', { replace: true })
    }

    const goHome = () => {
        navigate('/')
    }

    return (
        <PageTransition>
            <div className="admin-layout">
                {/* Sidebar Desktop */}
                <aside className="admin-sidebar glass-card">
                    <div className="admin-sidebar-header">
                        <div className="admin-logo">
                            <LayoutDashboard size={24} />
                            <h2>Admin Panel</h2>
                        </div>
                        <p className="admin-email">{user?.email}</p>
                    </div>

                    <nav className="admin-nav">
                        {tabs.map((tab) => {
                            const Icon = tab.icon
                            return (
                                <button
                                    key={tab.id}
                                    className={`admin-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    <Icon size={18} />
                                    <span>{tab.label}</span>
                                    {activeTab === tab.id && (
                                        <motion.div 
                                            className="nav-active-bg" 
                                            layoutId="nav-bg"
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </button>
                            )
                        })}
                    </nav>

                    <div className="admin-sidebar-footer">
                        <button className="admin-nav-item" onClick={goHome}>
                            <Home size={18} />
                            <span>Ke Halaman Utama</span>
                        </button>
                        <button className="admin-nav-item text-danger" onClick={handleLogout}>
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="admin-main">
                    {/* Header Mobile */}
                    <div className="admin-mobile-header glass-card">
                        <div className="admin-logo">
                            <LayoutDashboard size={20} />
                            <h2>Admin Dashboard</h2>
                        </div>
                        <button className="icon-btn text-danger" onClick={handleLogout}>
                            <LogOut size={18} />
                        </button>
                    </div>

                    {/* Mobile Tabs */}
                    <div className="admin-mobile-tabs hide-scroll">
                        {tabs.map((tab) => {
                            const Icon = tab.icon
                            return (
                                <button
                                    key={tab.id}
                                    className={`mobile-tab ${activeTab === tab.id ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    <Icon size={16} />
                                    <span>{tab.label}</span>
                                </button>
                            )
                        })}
                    </div>

                    <div className="admin-content">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="admin-content-inner"
                            >
                                {activeTab === 'jadwal' && <AdminSchedule />}
                                {activeTab === 'piket' && <AdminPiket />}
                                {activeTab === 'pengumuman' && <AdminAnnouncements />}
                                {activeTab === 'tugas' && <AdminTasks />}
                                {activeTab === 'anggota' && <AdminMembers />}
                                {activeTab === 'galeri' && <AdminGallery />}
                                {activeTab === 'confess' && <AdminConfess />}
                                {activeTab === 'dokumen' && <AdminDocuments />}
                                {activeTab === 'prestasi' && <AdminAchievements />}
                                {activeTab === 'kontak' && <AdminContact />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </PageTransition>
    )
}
