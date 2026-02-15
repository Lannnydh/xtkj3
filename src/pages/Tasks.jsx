import { useState } from 'react'
import { motion } from 'framer-motion'
import { List, LayoutGrid, Clock, BookOpen } from 'lucide-react'
import PageTransition, { staggerContainer, fadeInUp } from '../components/PageTransition'
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
                <h1 className="page-title">Tugas</h1>
                <p className="page-subtitle">Tracking tugas harian & mingguan kelas</p>

                <div className="tasks-toolbar">
                    <div className="view-toggle">
                        <button className={`toggle-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>
                            <List size={16} /> List
                        </button>
                        <button className={`toggle-btn ${view === 'kanban' ? 'active' : ''}`} onClick={() => setView('kanban')}>
                            <LayoutGrid size={16} /> Kanban
                        </button>
                    </div>
                </div>

                {view === 'list' && (
                    <motion.div className="tasks-list" variants={staggerContainer} initial="initial" animate="animate">
                        {tasks.map(t => (
                            <motion.div key={t.id} className="task-item glass-card" variants={fadeInUp}>
                                <div className="task-status-dot" style={{ background: statusColors[t.status] }} />
                                <div className="task-body">
                                    <h3>{t.name}</h3>
                                    <div className="task-meta">
                                        <span><BookOpen size={13} /> {t.mapel}</span>
                                        <span><Clock size={13} /> {t.deadline}</span>
                                    </div>
                                </div>
                                <span className="badge" style={{ background: `${statusColors[t.status]}15`, color: statusColors[t.status] }}>
                                    {statusLabels[t.status]}
                                </span>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {view === 'kanban' && (
                    <div className="kanban-board">
                        {kanbanCols.map(col => (
                            <div key={col} className="kanban-col">
                                <div className="kanban-header" style={{ borderColor: statusColors[col] }}>
                                    <span className="kanban-dot" style={{ background: statusColors[col] }} />
                                    <h3>{statusLabels[col]}</h3>
                                    <span className="kanban-count">{tasks.filter(t => t.status === col).length}</span>
                                </div>
                                <motion.div className="kanban-cards" variants={staggerContainer} initial="initial" animate="animate">
                                    {tasks.filter(t => t.status === col).map(t => (
                                        <motion.div key={t.id} className="kanban-card glass-card" variants={fadeInUp}>
                                            <h4>{t.name}</h4>
                                            <span className="kanban-mapel">{t.mapel}</span>
                                            <div className="kanban-foot">
                                                <Clock size={12} />
                                                <span>{t.deadline}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </PageTransition>
    )
}
