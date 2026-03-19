import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Clock, Users as UsersIcon, FileText, Loader } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
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

const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

const tabIcons = { jadwal: Clock, piket: UsersIcon, ujian: FileText }

function getSlotsForDay(day) {
    if (day === 'Jumat') return fridaySlots
    if (day === 'Sabtu') return saturdaySlots
    return timeSlots
}

export default function Schedule() {
    const [openDay, setOpenDay] = useState(null)
    const [tab, setTab] = useState('jadwal')
    
    // Supabase State
    const [scheduleRows, setScheduleRows] = useState([])
    const [piketRows, setPiketRows] = useState([])
    const [loading, setLoading] = useState(true)

    // Data ujian masih hardcoded karena tidak ada di spesifikasi awal admin
    // Bisa ditambahkan nanti kalau dibutuhkan
    const ujian = [
        { subject: 'Menunggu data dari sekolah', date: '-', type: 'Info' },
    ]

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                // Fetch Jadwal
                const { data: jadwalData, error: errJadwal } = await supabase
                    .from('jadwal')
                    .select('*')
                if (errJadwal) throw errJadwal

                // Fetch Piket
                const { data: piketData, error: errPiket } = await supabase
                    .from('piket')
                    .select('*')
                if (errPiket) throw errPiket

                setScheduleRows(jadwalData || [])
                setPiketRows(piketData || [])
            } catch (err) {
                console.error("Error fetching data:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const toggleDay = (d) => setOpenDay(openDay === d ? null : d)

    const getSubject = (day, jam) => {
        if (typeof jam === 'string') return null
        const item = scheduleRows.find(r => r.hari === day && r.jam_ke === String(jam))
        return item && item.mata_pelajaran ? item.mata_pelajaran : ''
    }

    const getPiketForDay = (day) => {
        return piketRows.filter(p => p.hari === day).map(p => p.nama_siswa)
    }

    return (
        <PageTransition>
            <div className="page-container">
                <motion.h1 className="page-title" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>Jadwal</motion.h1>
                <motion.p className="page-subtitle" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>Jadwal pelajaran, piket, dan ujian rill dari database</motion.p>

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

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
                        <Loader className="spin" size={32} style={{ color: 'var(--accent-primary)' }} />
                    </div>
                ) : (
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
                                    {days.map(day => {
                                        const piketSiswa = getPiketForDay(day)
                                        return (
                                            <motion.div
                                                key={day}
                                                className="piket-card glass-card"
                                                variants={bounceIn}
                                                whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(99,102,241,0.15)' }}
                                            >
                                                <h3>{day}</h3>
                                                <div className="piket-names">
                                                    {piketSiswa.length > 0 ? piketSiswa.map((n, i) => (
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
                                                    )) : (
                                                        <span style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Belum ada tabel piket</span>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )
                                    })}
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
                )}
            </div>
        </PageTransition>
    )
}
