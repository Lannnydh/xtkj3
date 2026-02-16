import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { List, LayoutGrid, Clock, BookOpen, CheckCircle } from 'lucide-react'
import PageTransition, { staggerContainer, fadeInUp, bounceIn } from '../components/PageTransition'
import './Tasks.css'

const tasks = [
    { id: 1, name: 'Laporan Praktek ASJ', mapel: 'ASJ', deadline: '14 Feb 2026', status: 'done' },
    { id: 2, name: 'Presentasi PKK Kelompok 3', mapel: 'PKK', deadline: '16 Feb 2026', status: 'progress' },
    { id: 3, name: 'Essay B. Indonesia', mapel: 'B. Indonesia', deadline: '15 Feb 2026', status: 'todo' },
    { id: 4, name: 'Soal Latihan Matematika Bab 5', mapel: 'Matematika', deadline: '17 Feb 2026', status: 'todo' },
    { id: 5, name: 'Rangkuman Fisika Semester 2', mapel: 'Fisika', deadline: '18 Feb 2026', status: 'progress' },
    { id: 6, name: 'Project Jaringan Komputer', mapel: 'Komputer Jaringan', deadline: '20 Feb 2026', status: 'todo' },
    { id: 7, name: 'Tugas TLJ Konfigurasi VoIP', mapel: 'TLJ', deadline: '13 Feb 2026', status: 'done' },
    { id: 8, name: 'Poster Hari Bahasa Inggris', mapel: 'B. Inggris', deadline: '19 Feb 2026', status: 'progress' },
]

const statusLabels = { todo: 'To Do', progress: 'In Progress', done: 'Done' }
const statusColors = { todo: 'var(--info)', progress: 'var(--warning)', done: 'var(--success)' }

export default function Tasks() {
    const [view, setView] = useState('list')

    const kanbanCols = ['todo', 'progress', 'done']

    return (
        <PageTransition>
            <div className="page-container">
                <motion.h1 className="page-title" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>Tugas</motion.h1>
                <motion.p className="page-subtitle" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>Tracking tugas harian & mingguan kelas</motion.p>

                <motion.div className="tasks-toolbar" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <div className="view-toggle">
                        <motion.button className={`toggle-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <List size={16} /> List
                        </motion.button>
                        <motion.button className={`toggle-btn ${view === 'kanban' ? 'active' : ''}`} onClick={() => setView('kanban')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <LayoutGrid size={16} /> Kanban
                        </motion.button>
                    </div>
                </motion.div>

                <AnimatePresence mode="wait">
                    {view === 'list' && (
                        <motion.div key="list" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <motion.div className="tasks-list" variants={staggerContainer} initial="initial" animate="animate">
                                {tasks.map(t => (
                                    <motion.div
                                        key={t.id}
                                        className="task-item glass-card"
                                        variants={fadeInUp}
                                        whileHover={{ scale: 1.02, x: 8, boxShadow: '0 8px 25px rgba(99,102,241,0.1)' }}
                                        whileTap={{ scale: 0.98 }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                    >
                                        <motion.div
                                            className="task-status-dot"
                                            style={{ background: statusColors[t.status] }}
                                            animate={t.status === 'progress' ? { scale: [1, 1.3, 1] } : {}}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        />
                                        <div className="task-body">
                                            <h3>{t.name}</h3>
                                            <div className="task-meta">
                                                <span><BookOpen size={13} /> {t.mapel}</span>
                                                <span><Clock size={13} /> {t.deadline}</span>
                                            </div>
                                        </div>
                                        <motion.span
                                            className="badge"
                                            style={{ background: `${statusColors[t.status]}15`, color: statusColors[t.status] }}
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            {statusLabels[t.status]}
                                        </motion.span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                    )}

                    {view === 'kanban' && (
                        <motion.div key="kanban" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <div className="kanban-board">
                                {kanbanCols.map(col => (
                                    <motion.div
                                        key={col}
                                        className="kanban-col"
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: kanbanCols.indexOf(col) * 0.1 }}
                                    >
                                        <div className="kanban-header" style={{ borderColor: statusColors[col] }}>
                                            <motion.span
                                                className="kanban-dot"
                                                style={{ background: statusColors[col] }}
                                                animate={col === 'progress' ? { scale: [1, 1.3, 1] } : {}}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                            />
                                            <h3>{statusLabels[col]}</h3>
                                            <span className="kanban-count">{tasks.filter(t => t.status === col).length}</span>
                                        </div>
                                        <motion.div className="kanban-cards" variants={staggerContainer} initial="initial" animate="animate">
                                            {tasks.filter(t => t.status === col).map(t => (
                                                <motion.div
                                                    key={t.id}
                                                    className="kanban-card glass-card"
                                                    variants={bounceIn}
                                                    whileHover={{ scale: 1.05, y: -5, boxShadow: '0 8px 25px rgba(99,102,241,0.12)' }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <h4>{t.name}</h4>
                                                    <span className="kanban-mapel">{t.mapel}</span>
                                                    <div className="kanban-foot">
                                                        <Clock size={12} />
                                                        <span>{t.deadline}</span>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </PageTransition>
    )
}
