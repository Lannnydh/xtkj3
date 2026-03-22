import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Loader, Trash2, Plus, Edit, X, Hash } from 'lucide-react'

export default function AdminContact() {
    const [contacts, setContacts] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    
    const [formData, setFormData] = useState({ id: null, platform: 'Instagram', username: '', url: '' })

    useEffect(() => { fetchContacts() }, [])

    const fetchContacts = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase.from('kontak').select('*').order('created_at', { ascending: false })
            if (error) throw error
            setContacts(data)
        } catch (error) {
            console.error('Error:', error)
            alert('Gagal mengambil data kontak')
        } finally { setLoading(false) }
    }

    const resetForm = () => { setFormData({ id: null, platform: 'Instagram', username: '', url: '' }); setIsEditing(false) }

    const handleDelete = async (id) => {
        if (!window.confirm('Yakin ingin menghapus kontak ini?')) return
        try {
            const { error } = await supabase.from('kontak').delete().eq('id', id)
            if (error) throw error
            setContacts(prev => prev.filter(c => c.id !== id))
        } catch (error) {
            console.error('Error:', error)
            alert('Gagal menghapus kontak')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setSaving(true)
            if (isEditing) {
                const { error } = await supabase.from('kontak').update({ ...formData }).eq('id', formData.id)
                if (error) throw error
            } else {
                const { id, ...insertData } = formData
                const { error } = await supabase.from('kontak').insert([insertData])
                if (error) throw error
            }
            await fetchContacts()
            resetForm()
            alert(isEditing ? 'Kontak diperbarui!' : 'Kontak ditambahkan!')
        } catch (error) {
            console.error('Error:', error)
            alert('Gagal menyimpan kontak')
        } finally { setSaving(false) }
    }

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader className="spin" size={32} /></div>

    return (
        <div>
            <div className="admin-page-header">
                <div>
                    <h1>Kelola Kontak / Sosmed</h1>
                    <p>Atur link Instagram, TikTok, atau Email kelas</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '24px', alignItems: 'start' }}>
                <div className="glass-card" style={{ padding: '24px', position: 'sticky', top: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3>{isEditing ? 'Edit Kontak' : 'Tambah Kontak'}</h3>
                        {isEditing && <button className="icon-btn text-danger" onClick={resetForm}><X size={16} /></button>}
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="admin-form-group">
                            <label>Platform (Bebas ketik)</label>
                            <input type="text" className="admin-input" value={formData.platform} onChange={(e) => setFormData({...formData, platform: e.target.value})} required placeholder="Contoh: Instagram, TikTok, Email" />
                        </div>
                        <div className="admin-form-group">
                            <label>Username / Teks Tampil</label>
                            <input type="text" className="admin-input" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} required placeholder="@xtkj3_smkpgri" />
                        </div>
                        <div className="admin-form-group">
                            <label>Link / URL Tujuan</label>
                            <input type="url" className="admin-input" value={formData.url} onChange={(e) => setFormData({...formData, url: e.target.value})} required placeholder="https://instagram.com/..." />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={saving}>
                            {saving ? <Loader className="spin" size={16} /> : (isEditing ? <Edit size={16}/> : <Plus size={16} />)}
                            {saving ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Tambah Kontak')}
                        </button>
                    </form>
                </div>

                <div className="admin-table-container glass-card" style={{ marginTop: 0 }}>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Platform</th>
                                <th>Username</th>
                                <th width="100px" style={{ textAlign: 'center' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.length === 0 ? (
                                <tr><td colSpan="3" style={{ textAlign: 'center', padding: '24px' }}>Belum ada kontak</td></tr>
                            ) : (
                                contacts.map(item => (
                                    <tr key={item.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Hash size={18} className="text-secondary" />
                                                <strong>{item.platform}</strong>
                                            </div>
                                        </td>
                                        <td><a href={item.url} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>{item.username}</a></td>
                                        <td>
                                            <div className="action-btns" style={{ justifyContent: 'center' }}>
                                                <button className="icon-btn" onClick={() => {setFormData(item); setIsEditing(true); window.scrollTo(0, 0)}}><Edit size={16} /></button>
                                                <button className="icon-btn text-danger" onClick={() => handleDelete(item.id)}><Trash2 size={16} /></button>
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
