import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Loader, Trash2, Plus, Edit, X, Upload } from 'lucide-react'

export default function AdminMembers() {
    const [members, setMembers] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    
    // File upload state
    const [uploading, setUploading] = useState(false)
    
    const [formData, setFormData] = useState({
        id: null,
        nama: '',
        peran: 'Murid',
        photo_url: ''
    })

    useEffect(() => {
        fetchMembers()
    }, [])

    const fetchMembers = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('anggota')
                .select('*')
                .order('created_at', { ascending: true })

            if (error) throw error
            setMembers(data)
        } catch (error) {
            console.error('Error fetching members:', error)
            alert('Gagal mengambil data anggota')
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setFormData({ id: null, nama: '', peran: 'Murid', photo_url: '' })
        setIsEditing(false)
    }

    const handleEdit = (item) => {
        setFormData(item)
        setIsEditing(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDelete = async (id, photo_url) => {
        if (!window.confirm('Yakin ingin menghapus anggota ini?')) return

        try {
            // Jika ada foto, hapus juga fotonya dari Storage
            if (photo_url) {
                const fileName = photo_url.split('/').pop()
                if (fileName) {
                    await supabase.storage.from('kelas_images').remove([`members/${fileName}`])
                }
            }

            const { error } = await supabase.from('anggota').delete().eq('id', id)
            if (error) throw error
            
            setMembers(prev => prev.filter(m => m.id !== id))
        } catch (error) {
            console.error('Error deleting member:', error)
            alert('Gagal menghapus anggota')
        }
    }

    const uploadImage = async (event) => {
        try {
            setUploading(true)
            const file = event.target.files[0]
            if (!file) return

            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `members/${fileName}`

            let { error: uploadError } = await supabase.storage
                .from('kelas_images')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            // Get public URL
            const { data } = supabase.storage
                .from('kelas_images')
                .getPublicUrl(filePath)
                
            setFormData(prev => ({ ...prev, photo_url: data.publicUrl }))

        } catch (error) {
            console.error('Error uploading image: ', error.message)
            alert('Gagal mengupload gambar. Pastikan bucket "kelas_images" sudah ada.')
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setSaving(true)
            if (isEditing) {
                const { error } = await supabase
                    .from('anggota')
                    .update({
                        nama: formData.nama,
                        peran: formData.peran,
                        photo_url: formData.photo_url
                    })
                    .eq('id', formData.id)

                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('anggota')
                    .insert([{
                        nama: formData.nama,
                        peran: formData.peran,
                        photo_url: formData.photo_url
                    }])

                if (error) throw error
            }
            
            await fetchMembers()
            resetForm()
            alert(isEditing ? 'Anggota diperbarui!' : 'Anggota ditambahkan!')
        } catch (error) {
            console.error('Error saving member:', error)
            alert('Gagal menyimpan anggota')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader className="spin" size={32} /></div>

    return (
        <div>
            <div className="admin-page-header">
                <div>
                    <h1>Kelola Anggota Kelas</h1>
                    <p>Tambah murid, wali kelas, atau pengurus</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '24px', alignItems: 'start' }}>
                <div className="glass-card" style={{ padding: '24px', position: 'sticky', top: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3>{isEditing ? 'Edit Anggota' : 'Tambah Anggota'}</h3>
                        {isEditing && <button className="icon-btn text-danger" onClick={resetForm}><X size={16} /></button>}
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="admin-form-group">
                            <label>Nama Lengkap</label>
                            <input type="text" className="admin-input" value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})} required />
                        </div>
                        <div className="admin-form-group">
                            <label>Peran / Jabatan</label>
                            <input type="text" className="admin-input" value={formData.peran} onChange={(e) => setFormData({...formData, peran: e.target.value})} placeholder="Contoh: Murid, Wali Kelas, Ketua Kelas" required />
                        </div>
                        <div className="admin-form-group">
                            <label>Foto</label>
                            {formData.photo_url && (
                                <img src={formData.photo_url} alt="Preview" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />
                            )}
                            <label className="btn-secondary" style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer', padding: '10px' }}>
                                {uploading ? <Loader className="spin" size={16} /> : <Upload size={16} />}
                                {uploading ? 'Mengupload...' : 'Pilih Foto (Opsional)'}
                                <input type="file" accept="image/*" onChange={uploadImage} style={{ display: 'none' }} disabled={uploading} />
                            </label>
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={saving || uploading}>
                            {saving ? <Loader className="spin" size={16} /> : (isEditing ? <Edit size={16}/> : <Plus size={16} />)}
                            {saving ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Tambah Anggota')}
                        </button>
                    </form>
                </div>

                <div className="admin-table-container glass-card" style={{ marginTop: 0 }}>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th width="60px">Foto</th>
                                <th>Nama</th>
                                <th>Peran</th>
                                <th width="100px" style={{ textAlign: 'center' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.length === 0 ? (
                                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '24px' }}>Belum ada anggota</td></tr>
                            ) : (
                                members.map(item => (
                                    <tr key={item.id}>
                                        <td>
                                            {item.photo_url ? (
                                                <img src={item.photo_url} alt={item.nama} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'var(--text-muted)' }}>No Pic</div>
                                            )}
                                        </td>
                                        <td>{item.nama}</td>
                                        <td><span className="badge badge-info">{item.peran}</span></td>
                                        <td>
                                            <div className="action-btns" style={{ justifyContent: 'center' }}>
                                                <button className="icon-btn" onClick={() => handleEdit(item)}><Edit size={16} /></button>
                                                <button className="icon-btn text-danger" onClick={() => handleDelete(item.id, item.photo_url)}><Trash2 size={16} /></button>
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
