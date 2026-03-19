import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Loader, Trash2, Plus, Save } from 'lucide-react'

export default function AdminPiket() {
    const [piket, setPiket] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [selectedDay, setSelectedDay] = useState('Senin')
    const [newName, setNewName] = useState('')

    const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

    useEffect(() => {
        fetchPiket()
    }, [])

    const fetchPiket = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('piket')
                .select('*')
                .order('nama_siswa', { ascending: true })

            if (error) throw error
            setPiket(data)
        } catch (error) {
            console.error('Error fetching piket:', error)
            alert('Gagal mengambil data piket')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Hapus siswa dari jadwal piket ini?')) return

        try {
            const { error } = await supabase
                .from('piket')
                .delete()
                .eq('id', id)

            if (error) throw error
            
            // Update local state
            setPiket(prev => prev.filter(p => p.id !== id))
        } catch (error) {
            console.error('Error deleting piket:', error)
            alert('Gagal menghapus jadwal piket')
        }
    }

    const handleAdd = async (e) => {
        e.preventDefault()
        if (!newName.trim()) return

        try {
            setSaving(true)
            const { data, error } = await supabase
                .from('piket')
                .insert([
                    { hari: selectedDay, nama_siswa: newName }
                ])
                .select()

            if (error) throw error
            
            // Update local state
            setPiket(prev => [...prev, data[0]])
            setNewName('')
        } catch (error) {
            console.error('Error adding piket:', error)
            alert('Gagal menambahkan jadwal piket')
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

    const activeDayPiket = piket.filter(item => item.hari === selectedDay)

    return (
        <div>
            <div className="admin-page-header">
                <div>
                    <h1>Kelola Jadwal Piket</h1>
                    <p>Tambah atau hapus siswa dari daftar piket</p>
                </div>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', alignItems: 'start', marginTop: '24px' }}>
                
                {/* Form Tambah */}
                <div className="glass-card" style={{ padding: '24px' }}>
                    <h3 style={{ marginBottom: '16px' }}>Tambah Piket ({selectedDay})</h3>
                    <form onSubmit={handleAdd}>
                        <div className="admin-form-group">
                            <label>Nama Siswa</label>
                            <input 
                                type="text"
                                className="admin-input"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Contoh: Budi Santoso"
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="btn-primary" 
                            style={{ width: '100%', marginTop: '8px' }}
                            disabled={saving}
                        >
                            {saving ? <Loader className="spin" size={16} /> : <Plus size={16} />}
                            {saving ? 'Menambahkan...' : 'Tambah Siswa'}
                        </button>
                    </form>
                </div>

                {/* List Piket */}
                <div className="admin-table-container glass-card" style={{ marginTop: 0 }}>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Nama Siswa</th>
                                <th width="100px" style={{ textAlign: 'center' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeDayPiket.length === 0 ? (
                                <tr>
                                    <td colSpan="2" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                                        Belum ada jadwal piket hari ini
                                    </td>
                                </tr>
                            ) : (
                                activeDayPiket.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.nama_siswa}</td>
                                        <td>
                                            <div className="action-btns" style={{ justifyContent: 'center' }}>
                                                <button 
                                                    className="icon-btn text-danger" 
                                                    onClick={() => handleDelete(item.id)}
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    )
}
