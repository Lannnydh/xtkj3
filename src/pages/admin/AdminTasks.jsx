import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Loader, Trash2, Plus, Edit, X } from 'lucide-react'

export default function AdminTasks() {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    
    // Form state
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        mapel: '',
        deadline: '',
        status: 'todo' // todo, progress, done
    })

    useEffect(() => {
        fetchTasks()
    }, [])

    const fetchTasks = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('tugas')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setTasks(data)
        } catch (error) {
            console.error('Error fetching tasks:', error)
            alert('Gagal mengambil data tugas')
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setFormData({
            id: null, name: '', mapel: '', deadline: '', status: 'todo'
        })
        setIsEditing(false)
    }

    const handleEdit = (item) => {
        // Formate date from dd MMM yyyy to yyyy-mm-dd for input type date if needed
        // but since we save it as string, we can just edit the string or use text input
        setFormData(item)
        setIsEditing(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Yakin ingin menghapus tugas ini?')) return

        try {
            const { error } = await supabase
                .from('tugas')
                .delete()
                .eq('id', id)

            if (error) throw error
            
            setTasks(prev => prev.filter(t => t.id !== id))
        } catch (error) {
            console.error('Error deleting task:', error)
            alert('Gagal menghapus tugas')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try {
            setSaving(true)
            
            if (isEditing) {
                // UPDATE
                const { error } = await supabase
                    .from('tugas')
                    .update({
                        name: formData.name,
                        mapel: formData.mapel,
                        deadline: formData.deadline,
                        status: formData.status
                    })
                    .eq('id', formData.id)

                if (error) throw error
            } else {
                // INSERT
                const { error } = await supabase
                    .from('tugas')
                    .insert([{
                        name: formData.name,
                        mapel: formData.mapel,
                        deadline: formData.deadline,
                        status: formData.status
                    }])

                if (error) throw error
            }
            
            await fetchTasks() // Refresh data
            resetForm()
            alert(isEditing ? 'Tugas diperbarui!' : 'Tugas ditambahkan!')
            
        } catch (error) {
            console.error('Error saving task:', error)
            alert('Gagal menyimpan tugas')
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
                    <h1>Kelola Tugas Kelas</h1>
                    <p>Tambah tugas baru atau update status pekerjaan</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '24px', alignItems: 'start' }}>
                
                {/* Form CRUD */}
                <div className="glass-card" style={{ padding: '24px', position: 'sticky', top: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3>{isEditing ? 'Edit Tugas' : 'Tambah Baru'}</h3>
                        {isEditing && (
                            <button className="icon-btn text-danger" onClick={resetForm}>
                                <X size={16} />
                            </button>
                        )}
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="admin-form-group">
                            <label>Nama Tugas / Project</label>
                            <input 
                                type="text"
                                className="admin-input"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="Contoh: Laporan Praktek ASJ"
                                required
                            />
                        </div>

                        <div className="admin-form-group">
                            <label>Mata Pelajaran</label>
                            <input 
                                type="text"
                                className="admin-input"
                                value={formData.mapel}
                                onChange={(e) => setFormData({...formData, mapel: e.target.value})}
                                placeholder="Contoh: ASJ"
                                required
                            />
                        </div>

                        <div className="admin-form-group">
                            <label>Deadline</label>
                            <input 
                                type="text"
                                className="admin-input"
                                value={formData.deadline}
                                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                                placeholder="Contoh: 14 Feb 2026"
                                required
                            />
                        </div>

                        <div className="admin-form-group">
                            <label>Status</label>
                            <select 
                                className="admin-select"
                                value={formData.status}
                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                            >
                                <option value="todo">Belum Dikerjakan (To Do)</option>
                                <option value="progress">Sedang Dikerjakan (In Progress)</option>
                                <option value="done">Selesai (Done)</option>
                            </select>
                        </div>

                        <button 
                            type="submit" 
                            className="btn-primary" 
                            style={{ width: '100%', marginTop: '16px' }}
                            disabled={saving}
                        >
                            {saving ? <Loader className="spin" size={16} /> : (isEditing ? <Edit size={16}/> : <Plus size={16} />)}
                            {saving ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Tambah Tugas')}
                        </button>
                    </form>
                </div>

                {/* List Tugas */}
                <div className="admin-table-container glass-card" style={{ marginTop: 0 }}>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Tugas</th>
                                <th>Mata Pelajaran</th>
                                <th>Status</th>
                                <th width="120px" style={{ textAlign: 'center' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                                        Belum ada tugas satupun
                                    </td>
                                </tr>
                            ) : (
                                tasks.map(item => {
                                    const statusColors = { todo: 'var(--info)', progress: 'var(--warning)', done: 'var(--success)' }
                                    const statusLabels = { todo: 'To Do', progress: 'In Progress', done: 'Done' }
                                    
                                    return (
                                        <tr key={item.id}>
                                            <td>
                                                <div style={{ fontWeight: '600', marginBottom: '4px' }}>{item.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-danger)' }}>Batas Waktu: {item.deadline}</div>
                                            </td>
                                            <td>{item.mapel}</td>
                                            <td>
                                                <span 
                                                    className="badge" 
                                                    style={{ 
                                                        background: `${statusColors[item.status]}15`, 
                                                        color: statusColors[item.status] 
                                                    }}
                                                >
                                                    {statusLabels[item.status]}
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
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    )
}
