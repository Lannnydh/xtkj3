import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Save, Loader } from 'lucide-react'

export default function AdminSchedule() {
    const [schedule, setSchedule] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [selectedDay, setSelectedDay] = useState('Senin')

    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

    useEffect(() => {
        fetchSchedule()
    }, [])

    const fetchSchedule = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('jadwal')
                .select('*')
                .order('id', { ascending: true })

            if (error) throw error
            setSchedule(data)
        } catch (error) {
            console.error('Error fetching schedule:', error)
            alert('Gagal mengambil data jadwal')
        } finally {
            setLoading(false)
        }
    }

    const handleSubjectChange = (id, newSubject) => {
        setSchedule(prev => prev.map(item => 
            item.id === id ? { ...item, mata_pelajaran: newSubject } : item
        ))
    }

    const handleSave = async () => {
        try {
            setSaving(true)
            
            // Filter only the schedule for the selected day to update
            const daySchedule = schedule.filter(item => item.hari === selectedDay)
            
            for (const item of daySchedule) {
                const { error } = await supabase
                    .from('jadwal')
                    .update({ mata_pelajaran: item.mata_pelajaran })
                    .eq('id', item.id)

                if (error) throw error
            }

            alert('Jadwal berhasil disimpan!')
        } catch (error) {
            console.error('Error saving schedule:', error)
            alert('Gagal menyimpan jadwal')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                <Loader className="spin" size={32} />
            </div>
        )
    }

    const activeDaySchedule = schedule.filter(item => item.hari === selectedDay)

    return (
        <div>
            <div className="admin-page-header">
                <div>
                    <h1>Kelola Jadwal Kelas</h1>
                    <p>Edit mata pelajaran untuk setiap jam pelajaran</p>
                </div>
                <button 
                    className="btn-primary" 
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? <Loader className="spin" size={18} /> : <Save size={18} />}
                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
            </div>

            <div className="admin-form-group" style={{ maxWidth: '200px' }}>
                <label>Pilih Hari</label>
                <select 
                    className="admin-select"
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                >
                    {days.map(day => (
                        <option key={day} value={day}>{day}</option>
                    ))}
                </select>
            </div>

            <div className="admin-table-container glass-card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th width="15%">Jam Ke</th>
                            <th width="25%">Waktu</th>
                            <th width="60%">Mata Pelajaran</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeDaySchedule.map(item => {
                            const isBreak = item.jam_ke === 'Istirahat'
                            return (
                                <tr key={item.id}>
                                    <td>
                                        <span className={isBreak ? "badge badge-warning" : "badge badge-info"}>
                                            {isBreak ? 'Istirahat' : `Jam ${item.jam_ke}`}
                                        </span>
                                    </td>
                                    <td>{item.waktu}</td>
                                    <td>
                                        {isBreak ? (
                                            <span style={{ color: 'var(--text-muted)' }}>— Waktu Istirahat —</span>
                                        ) : (
                                            <input 
                                                type="text"
                                                className="admin-input"
                                                value={item.mata_pelajaran}
                                                onChange={(e) => handleSubjectChange(item.id, e.target.value)}
                                                placeholder="Kosongkan jika tidak ada pelajaran"
                                            />
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
