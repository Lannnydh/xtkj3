import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Clock, Users as UsersIcon, FileText } from 'lucide-react'
import PageTransition, { staggerContainer, fadeInUp, bounceIn } from '../components/PageTransition'
import './Schedule.css'

const timeSlots = [
    { jam: 1, time: '07:00 - 07:45' },
    { jam: 2, time: '07:45 - 08:30' },
    { jam: 3, time: '08:30 - 09:15' },
    { jam: 4, time: '09:15 - 10:00' },
    { jam: 'Istirahat', time: '10:00 - 10:15' },
    { jam: 5, time: '10:15 - 11:00' },
    { jam: 6, time: '11:00 - 11:45' },
    { jam: 7, time: '11:45 - 12:30' },
    { jam: 8, time: '12:30 - 13:15' },
    { jam: 'Istirahat', time: '13:15 - 13:30' },
    { jam: 9, time: '13:30 - 14:10' },
    { jam: 10, time: '14:10 - 14:50' },
]

const fridaySlots = [
    { jam: 1, time: '07:00 - 07:45' },
    { jam: 2, time: '07:45 - 08:30' },
    { jam: 3, time: '08:30 - 09:15' },
    { jam: 4, time: '09:15 - 10:00' },
    { jam: 'Istirahat', time: '10:00 - 10:15' },
    { jam: 5, time: '10:15 - 11:00' },
    { jam: 6, time: '11:00 - 11:45' },
    { jam: 'Istirahat', time: '11:45 - 13:00' },
    { jam: 7, time: '13:00 - 13:40' },
    { jam: 8, time: '13:40 - 14:20' },
    { jam: 9, time: '14:20 - 15:00' },
    { jam: 10, time: '15:00 - 15:40' },
]

const saturdaySlots = [
    { jam: 1, time: '07:00 - 07:45' },
    { jam: 2, time: '07:45 - 08:30' },
    { jam: 3, time: '08:30 - 09:15' },
    { jam: 4, time: '09:15 - 10:00' },
    { jam: 'Istirahat', time: '10:00 - 10:15' },
    { jam: 5, time: '10:15 - 11:00' },
    { jam: 6, time: '11:00 - 11:45' },
    { jam: 7, time: '11:45 - 12:30' },
    { jam: 8, time: '12:30 - 13:15' },
]

const scheduleData = {
    Senin: {
        1: 'Matematika',
        2: 'Matematika',
        3: 'Matematika',
        4: 'Matematika',
        5: 'BING',
        6: 'BING',
        7: 'BINA',
        8: 'BINA',
        9: 'BINA',
        10: 'BINA',
    },
    Selasa: {
        1: 'Informatika',
        2: 'Informatika',
        3: 'Informatika',
        4: 'Informatika',
        5: 'DDP1',
        6: 'DDP1',
        7: 'DDP1',
        8: 'DDP1',
        9: 'Mulok Produktif',
        10: 'Mulok Produktif',
    },
    Rabu: {
        1: 'Sejarah',
        2: 'Sejarah',
        3: 'Seni Budaya',
        4: 'Seni Budaya',
        5: 'Penjas Orkes',
        6: 'Penjas Orkes',
        7: 'Penjas Orkes',
        8: 'PABP',
        9: 'PABP',
        10: 'PABP',
    },
    Kamis: {
        1: 'DDP2',
        2: 'DDP2',
        3: 'DDP2',
        4: 'DDP2',
        5: 'TJKT3',
        6: 'TJKT3',
        7: 'TJKT3',
        8: 'TJKT3',
        9: 'PGRI',
        10: 'Bahasa Jepang',
    },
    Jumat: {
        1: 'PPKN',
        2: 'PPKN',
        3: 'BING',
        4: 'BING',
        5: 'Bahasa Jawa',
        6: 'BP BK',
        7: '',
        8: '',
        9: 'Pramuka',
        10: 'Pramuka',
    },
    Sabtu: {
        1: '',
        2: 'Mulok',
        3: 'Projek IPAS',
        4: 'Projek IPAS',
        5: 'Projek IPAS',
        6: 'Projek IPAS',
        7: 'Projek IPAS',
        8: 'Projek IPAS',
    },
}

const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

const piket = {
    Senin: ['Elvira', 'Enesia', 'Erawati', 'Estianza', 'Faulina', 'Favian'],
    Selasa: ['Faza', 'Fellia', 'Fitria', 'Hanafi', 'Hendy', 'Hesti'],
    Rabu: ['Heven', 'Icha', 'Ilham', 'Intan', 'Irsqah', 'Jasson'],
    Kamis: ['Jenita', 'Jessica', 'Jevelin', 'Jua', 'Kafina', 'Keand'],
    Jumat: ['Kervin', 'Kevin', 'Layli', 'Lensi', 'Lina', 'Lutfiana'],
    Sabtu: ['Marchel', 'Maulana', 'Melisa', 'Mikael', 'Mochammad'],
}

const ujian = [
    { subject: 'Menunggu data dari sekolah', date: '-', type: 'Info' },
]

const tabIcons = { jadwal: Clock, piket: UsersIcon, ujian: FileText }

function getSlotsForDay(day) {
    if (day === 'Jumat') return fridaySlots
    if (day === 'Sabtu') return saturdaySlots
    return timeSlots
}

function getSubject(day, jam) {
    const dayData = scheduleData[day]
    if (!dayData || typeof jam === 'string') return null
    const subject = dayData[jam]
    return subject !== undefined ? subject : ''
}

export default function Schedule() {
    const [openDay, setOpenDay] = useState(null)
    const [tab, setTab] = useState('jadwal')

    const toggleDay = (d) => setOpenDay(openDay === d ? null : d)

    return (
        <PageTransition>
            <div className="page-container">
                <motion.h1 className="page-title" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>Jadwal</motion.h1>
                <motion.p className="page-subtitle" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>Jadwal pelajaran, piket, dan ujian kelas X TKJ 3 — SMK PGRI Wlingi</motion.p>

                <motion.div
                    className="schedule-tabs"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {['jadwal', 'piket', 'ujian'].map(t => {
                        const Icon = tabIcons[t]
                        return (
                            <motion.button
                                key={t}
                                className={`chip ${tab === t ? 'active' : ''}`}
                                onClick={() => setTab(t)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Icon size={14} />
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </motion.button>
                        )
                    })}
                </motion.div>

                <AnimatePresence mode="wait">
                    {tab === 'jadwal' && (
                        <motion.div key="jadwal" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            {/* Desktop tables per day */}
                            <div className="schedule-desktop">
                                {days.map((day, dayIdx) => {
                                    const slots = getSlotsForDay(day)
                                    return (
                                        <motion.div
                                            key={day}
                                            className="schedule-table-wrap"
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: dayIdx * 0.08 }}
                                        >
                                            <h3 className="table-section-title">{day}</h3>
                                            <table className="schedule-table">
                                                <thead>
                                                    <tr>
                                                        <th>Jam Ke</th>
                                                        <th>Waktu</th>
                                                        <th>Mata Pelajaran</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {slots.map((s, i) => {
                                                        const isBreak = typeof s.jam === 'string'
                                                        const subject = getSubject(day, s.jam)
                                                        return (
                                                            <motion.tr
                                                                key={i}
                                                                className={isBreak ? 'break-row' : ''}
                                                                initial={{ opacity: 0, x: -20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: i * 0.03, type: 'spring', stiffness: 200 }}
                                                                whileHover={{ backgroundColor: 'rgba(99,102,241,0.05)', x: 3 }}
                                                            >
                                                                <td className={isBreak ? 'break-cell' : 'jam-cell'}>
                                                                    {isBreak ? s.jam : `Jam ${s.jam}`}
                                                                </td>
                                                                <td className="time-cell">{s.time}</td>
                                                                <td>
                                                                    {isBreak
                                                                        ? '—'
                                                                        : subject
                                                                            ? <span className="subject-name">{subject}</span>
                                                                            : <span className="empty-subject">—</span>
                                                                    }
                                                                </td>
                                                            </motion.tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                        </motion.div>
                                    )
                                })}
                            </div>

                            {/* Mobile accordion */}
                            <div className="schedule-mobile">
                                {days.map(day => {
                                    const slots = getSlotsForDay(day)
                                    return (
                                        <motion.div
                                            key={day}
                                            className="accordion-item glass-card"
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            whileHover={{ scale: 1.01 }}
                                        >
                                            <button className="accordion-header" onClick={() => toggleDay(day)}>
                                                <span className="accordion-day">{day}</span>
                                                <span className="accordion-count">{slots.filter(s => typeof s.jam === 'number').length} jam</span>
                                                <motion.div animate={{ rotate: openDay === day ? 180 : 0 }} transition={{ duration: 0.3 }}>
                                                    <ChevronDown size={18} />
                                                </motion.div>
                                            </button>
                                            <AnimatePresence>
                                                {openDay === day && (
                                                    <motion.div
                                                        className="accordion-body"
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        {slots.map((s, i) => {
                                                            const isBreak = typeof s.jam === 'string'
                                                            const subject = getSubject(day, s.jam)
                                                            return (
                                                                <motion.div
                                                                    key={i}
                                                                    className={`accordion-row ${isBreak ? 'break-row-mobile' : ''}`}
                                                                    initial={{ opacity: 0, x: -10 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{ delay: i * 0.02 }}
                                                                >
                                                                    <span className="acc-time">{s.time}</span>
                                                                    <div>
                                                                        <div className="acc-subject">
                                                                            {isBreak
                                                                                ? s.jam
                                                                                : subject
                                                                                    ? `Jam ${s.jam} — ${subject}`
                                                                                    : `Jam ${s.jam} — `
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </motion.div>
                                                            )
                                                        })}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </motion.div>
                    )}

                    {tab === 'piket' && (
                        <motion.div key="piket" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <motion.div className="piket-grid" variants={staggerContainer} initial="initial" animate="animate">
                                {days.map(day => (
                                    <motion.div
                                        key={day}
                                        className="piket-card glass-card"
                                        variants={bounceIn}
                                        whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(99,102,241,0.15)' }}
                                    >
                                        <h3>{day}</h3>
                                        <div className="piket-names">
                                            {piket[day].map((n, i) => (
                                                <motion.span
                                                    key={i}
                                                    className="piket-name"
                                                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    transition={{ delay: i * 0.06, type: 'spring', stiffness: 300 }}
                                                    whileHover={{ scale: 1.1, y: -3 }}
                                                >
                                                    {n}
                                                </motion.span>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                    )}

                    {tab === 'ujian' && (
                        <motion.div key="ujian" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <motion.div className="ujian-list" variants={staggerContainer} initial="initial" animate="animate">
                                {ujian.map((u, i) => (
                                    <motion.div
                                        key={i}
                                        className="ujian-card glass-card"
                                        variants={fadeInUp}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <motion.div
                                            className="ujian-badge"
                                            animate={{ scale: [1, 1.05, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            {u.type}
                                        </motion.div>
                                        <h3>{u.subject}</h3>
                                        <p>{u.date}</p>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </PageTransition>
    )
}
