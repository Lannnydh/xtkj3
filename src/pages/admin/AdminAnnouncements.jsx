import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Loader, Trash2, Plus, Edit, X } from 'lucide-react'

// Fungsi format tanggal (ex: 20 Feb 2026)
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric'
    })
}

export default function AdminAnnouncements() {
    const [announcements, setAnnouncements] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    
    // Form state
    const [formData, setFormData] = useState({
        id: null,
        title: '',
        deskripsi: '',
        author: 'Wali Kelas',
        category: 'tugas', // tugas, ujian, event
        status: 'aktif' // aktif, selesai
    })

    useEffect(() => {
        fetchAnnouncements()
    }, [])

    const fetchAnnouncements = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('pengumuman')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setAnnouncements(data)
        } catch (error) {
            console.error('Error fetching announcements:', error)
            alert('Gagal mengambil data pengumuman')
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setFormData({
            id: null, title: '', deskripsi: '', author: 'Wali Kelas', category: 'tugas', status: 'aktif'
        })
        setIsEditing(false)
    }

    const handleEdit = (item) => {
        setFormData(item)
        setIsEditing(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Yakin ingin menghapus pengumuman ini?')) return

        try {
            const { error } = await supabase
                .from('pengumuman')
                .delete()
                .eq('id', id)

            if (error) throw error
            
            setAnnouncements(prev => prev.filter(p => p.id !== id))
        } catch (error) {
            console.error('Error deleting announcement:', error)
            alert('Gagal menghapus pengumuman')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try {
            setSaving(true)
            
            if (isEditing) {
                // UPDATE
                const { error } = await supabase
                    .from('pengumuman')
                    .update({
                        title: formData.title,
                        deskripsi: formData.deskripsi,
                        author: formData.author,
                        category: formData.category,
                        status: formData.status
                    })
                    .eq('id', formData.id)

                if (error) throw error
            } else {
                // INSERT
                const { error } = await supabase
                    .from('pengumuman')
                    .insert([{
                        title: formData.title,
                        deskripsi: formData.deskripsi,
                        author: formData.author,
                        category: formData.category,
                        status: formData.status,
                        date: formatDate(new Date()) // Set current date as string
                    }])

                if (error) throw error
            }
            
            await fetchAnnouncements() // Refresh data
            resetForm()
            alert(isEditing ? 'Pengumuman diperbarui!' : 'Pengumuman ditambahkan!')
            
        } catch (error) {
            console.error('Error saving announcement:', error)
            alert('Gagal menyimpan pengumuman')
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

    return (
        <div>
            <div className="admin-page-header">
                <div>
                    <h1>Kelola Pengumuman</h1>
                    <p>Tambah, edit, atau hapus pengumuman kelas</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '24px', alignItems: 'start' }}>
                
                {/* Form CRUD */}
                <div className="glass-card" style={{ padding: '24px', position: 'sticky', top: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3>{isEditing ? 'Edit Pengumuman' : 'Tambah Baru'}</h3>
                        {isEditing && (
                            <button className="icon-btn text-danger" onClick={resetForm}>
                                <X size={16} />
                            </button>
                        )}
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="admin-form-group">
                            <label>Judul Pengumuman</label>
                            <input 
                                type="text"
                                className="admin-input"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                required
                            />
                        </div>

                        <div className="admin-form-group">
                            <label>Isi/Deskripsi</label>
                            <textarea 
                                className="admin-textarea"
                                value={formData.deskripsi}
                                onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                                required
                            />
                        </div>

                        <div className="admin-form-group">
                            <label>Kategori</label>
                            <select 
                                className="admin-select"
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                            >
                                <option value="tugas">Tugas</option>
                                <option value="ujian">Ujian</option>
                                <option value="event">Event / Info</option>
                            </select>
                        </div>

                        <div className="admin-form-group">
                            <label>Pembuat (Author)</label>
                            <select 
                                className="admin-select"
                                value={formData.author}
                                onChange={(e) => setFormData({...formData, author: e.target.value})}
                            >
                                <option value="Wali Kelas">Wali Kelas</option>
                                <option value="Ketua Kelas">Ketua Kelas</option>
                                <option value="Sekretaris">Sekretaris</option>
                                <option value="Bendahara">Bendahara</option>
                                <option value="OSIS">OSIS</option>
                            </select>
                        </div>

                        <div className="admin-form-group">
                            <label>Status</label>
                            <select 
                                className="admin-select"
                                value={formData.status}
                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                            >
                                <option value="aktif">Aktif</option>
                                <option value="selesai">Selesai</option>
                            </select>
                        </div>

                        <button 
                            type="submit" 
                            className="btn-primary" 
                            style={{ width: '100%', marginTop: '16px' }}
                            disabled={saving}
                        >
                            {saving ? <Loader className="spin" size={16} /> : (isEditing ? <Edit size={16}/> : <Plus size={16} />)}
                            {saving ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Buat Pengumuman')}
                        </button>
                    </form>
                </div>

                {/* List Pengumuman */}
                <div className="admin-table-container glass-card" style={{ marginTop: 0 }}>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Pengumuman</th>
                                <th>Kategori</th>
                                <th>Status</th>
                                <th width="120px" style={{ textAlign: 'center' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {announcements.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                                        Belum ada pengumuman satupun
                                    </td>
                                </tr>
                            ) : (
                                announcements.map(item => (
                                    <tr key={item.id}>
                                        <td>
                                            <div style={{ fontWeight: '600', marginBottom: '4px' }}>{item.title}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.date} • by {item.author}</div>
                                        </td>
                                        <td>
                                            <span className="badge badge-info">{item.category}</span>
                                        </td>
                                        <td>
                                            <span className={`badge ${item.status === 'aktif' ? 'badge-success' : 'badge-warning'}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-btns" style={{ justifyContent: 'center' }}>
                                                <button 
                                                    className="icon-btn" 
                                                    onClick={() => handleEdit(item)}
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>
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
