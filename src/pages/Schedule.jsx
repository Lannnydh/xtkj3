import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Clock } from 'lucide-react'
import PageTransition, { staggerContainer, fadeInUp } from '../components/PageTransition'
import './Schedule.css'

/* Jam pelajaran Senin-Sabtu (kecuali Jumat) */
const regularSlots = [
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
    { jam: 11, time: '14:50 - 15:30' },
    { jam: 12, time: '15:30 - 16:10' },
]

/* Jam pelajaran khusus Jumat */
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

export default function Schedule() {
    const [openDay, setOpenDay] = useState(null)
    const [tab, setTab] = useState('jadwal')

    const toggleDay = (d) => setOpenDay(openDay === d ? null : d)

    return (
        <PageTransition>
            <div className="page-container">
                <motion.h1 className="page-title" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>Jadwal</motion.h1>
                <motion.p className="page-subtitle" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>Jadwal pelajaran, piket, dan ujian kelas X TKJ 3 — SMK PGRI Wlingi</motion.p>

                <div className="schedule-tabs">
                    {['jadwal', 'piket', 'ujian'].map(t => (
                        <button key={t} className={`chip ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                    ))}
                </div>

                {tab === 'jadwal' && (
                    <>
                        {/* Info box */}
                        <motion.div className="info-box glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <Clock size={18} />
                            <p>Mata pelajaran belum diisi — jam pelajaran sudah sesuai jadwal sekolah. Khusus Jum'at memiliki jam yang berbeda.</p>
                        </motion.div>

                        {/* Desktop Tables - Regular & Friday */}
                        <motion.div className="schedule-table-wrap" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <h3 className="table-section-title">Senin - Kamis & Sabtu</h3>
                            <table className="schedule-table">
                                <thead>
                                    <tr>
                                        <th>Jam Ke</th>
                                        <th>Waktu</th>
                                        <th>Mata Pelajaran</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {regularSlots.map((s, i) => (
                                        <motion.tr
                                            key={i}
                                            className={typeof s.jam === 'string' ? 'break-row' : ''}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.04 }}
                                        >
                                            <td className={typeof s.jam === 'string' ? 'break-cell' : 'jam-cell'}>
                                                {typeof s.jam === 'string' ? s.jam : `Jam ${s.jam}`}
                                            </td>
                                            <td className="time-cell">{s.time}</td>
                                            <td>{typeof s.jam === 'string' ? '—' : <span className="pending-subject">Menyusul</span>}</td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </motion.div>

                        <motion.div className="schedule-table-wrap friday-table" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                            <h3 className="table-section-title">Khusus Jum'at</h3>
                            <table className="schedule-table">
                                <thead>
                                    <tr>
                                        <th>Jam Ke</th>
                                        <th>Waktu</th>
                                        <th>Mata Pelajaran</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fridaySlots.map((s, i) => (
                                        <motion.tr
                                            key={i}
                                            className={typeof s.jam === 'string' ? 'break-row' : ''}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.04 }}
                                        >
                                            <td className={typeof s.jam === 'string' ? 'break-cell' : 'jam-cell'}>
                                                {typeof s.jam === 'string' ? s.jam : `Jam ${s.jam}`}
                                            </td>
                                            <td className="time-cell">{s.time}</td>
                                            <td>{typeof s.jam === 'string' ? '—' : <span className="pending-subject">Menyusul</span>}</td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </motion.div>

                        {/* Mobile Accordion */}
                        <div className="schedule-mobile">
                            {days.map(day => {
                                const slots = day === 'Jumat' ? fridaySlots : regularSlots
                                return (
                                    <div key={day} className="accordion-item glass-card">
                                        <button className="accordion-header" onClick={() => toggleDay(day)}>
                                            <span className="accordion-day">{day}</span>
                                            <span className="accordion-count">{slots.filter(s => typeof s.jam === 'number').length} jam</span>
                                            <ChevronDown size={18} className={`accordion-chevron ${openDay === day ? 'open' : ''}`} />
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
                                                    {slots.map((s, i) => (
                                                        <div key={i} className={`accordion-row ${typeof s.jam === 'string' ? 'break-row-mobile' : ''}`}>
                                                            <span className="acc-time">{s.time}</span>
                                                            <div>
                                                                <div className="acc-subject">
                                                                    {typeof s.jam === 'string' ? s.jam : `Jam ${s.jam} — Menyusul`}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}

                {tab === 'piket' && (
                    <motion.div className="piket-grid" variants={staggerContainer} initial="initial" animate="animate">
                        {days.map(day => (
                            <motion.div
                                key={day}
                                className="piket-card glass-card"
                                variants={fadeInUp}
                                whileHover={{ scale: 1.03, boxShadow: '0 0 25px rgba(99,102,241,0.15)' }}
                            >
                                <h3>{day}</h3>
                                <div className="piket-names">
                                    {piket[day].map((n, i) => (
                                        <motion.span
                                            key={i}
                                            className="piket-name"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            {n}
                                        </motion.span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {tab === 'ujian' && (
                    <motion.div className="ujian-list" variants={staggerContainer} initial="initial" animate="animate">
                        {ujian.map((u, i) => (
                            <motion.div key={i} className="ujian-card glass-card" variants={fadeInUp}>
                                <div className="ujian-badge">{u.type}</div>
                                <h3>{u.subject}</h3>
                                <p>{u.date}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </PageTransition>
    )
}
