import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Loader, Trash2, Plus, Edit, X, Upload } from 'lucide-react'

export default function AdminAchievements() {
    const [achievements, setAchievements] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [uploading, setUploading] = useState(false)
    
    const [formData, setFormData] = useState({ id: null, judul: '', deskripsi: '', image_url: '', tanggal: '' })

    useEffect(() => { fetchAchievements() }, [])

    const fetchAchievements = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase.from('prestasi').select('*').order('created_at', { ascending: false })
            if (error) throw error
            setAchievements(data)
        } catch (error) {
            console.error('Error:', error)
            alert('Gagal mengambil data prestasi')
        } finally { setLoading(false) }
    }

    const resetForm = () => { setFormData({ id: null, judul: '', deskripsi: '', image_url: '', tanggal: '' }); setIsEditing(false) }

    const handleDelete = async (id, image_url) => {
        if (!window.confirm('Yakin ingin menghapus prestasi ini?')) return
        try {
            if (image_url) {
                const fileName = image_url.split('/').pop()
                if (fileName) await supabase.storage.from('kelas_images').remove([`achievements/${fileName}`])
            }
            const { error } = await supabase.from('prestasi').delete().eq('id', id)
            if (error) throw error
            setAchievements(prev => prev.filter(p => p.id !== id))
        } catch (error) {
            console.error('Error:', error)
            alert('Gagal menghapus prestasi')
        }
    }

    const uploadImage = async (event) => {
        try {
            setUploading(true)
            const file = event.target.files[0]
            if (!file) return

            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `achievements/${fileName}`

            let { error: uploadError } = await supabase.storage.from('kelas_images').upload(filePath, file)
            if (uploadError) throw uploadError

            const { data } = supabase.storage.from('kelas_images').getPublicUrl(filePath)
            setFormData(prev => ({ ...prev, image_url: data.publicUrl }))
        } catch (error) {
            console.error('Error:', error.message)
            alert('Gagal mengupload gambar. Pastikan bucket "kelas_images" sudah ada.')
        } finally { setUploading(false) }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setSaving(true)
            if (isEditing) {
                const { error } = await supabase.from('prestasi').update({ ...formData }).eq('id', formData.id)
                if (error) throw error
            } else {
                const { id, ...insertData } = formData
                const { error } = await supabase.from('prestasi').insert([insertData])
                if (error) throw error
            }
            await fetchAchievements()
            resetForm()
            alert(isEditing ? 'Prestasi diperbarui!' : 'Prestasi ditambahkan!')
        } catch (error) {
            console.error('Error:', error)
            alert('Gagal menyimpan prestasi')
        } finally { setSaving(false) }
    }

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader className="spin" size={32} /></div>

    return (
        <div>
            <div className="admin-page-header">
                <div>
                    <h1>Kelola Prestasi</h1>
                    <p>Tambahkan sertifikat, piala, atau pencapaian kelas lainnya</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '24px', alignItems: 'start' }}>
                <div className="glass-card" style={{ padding: '24px', position: 'sticky', top: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3>{isEditing ? 'Edit Prestasi' : 'Tambah Prestasi'}</h3>
                        {isEditing && <button className="icon-btn text-danger" onClick={resetForm}><X size={16} /></button>}
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="admin-form-group">
                            <label>Judul Prestasi</label>
                            <input type="text" className="admin-input" value={formData.judul} onChange={(e) => setFormData({...formData, judul: e.target.value})} required placeholder="Juara 1 Lomba Web Design" />
                        </div>
                        <div className="admin-form-group">
                            <label>Peraih (Deskripsi)</label>
                            <textarea className="admin-textarea" value={formData.deskripsi} onChange={(e) => setFormData({...formData, deskripsi: e.target.value})} required placeholder="Diraih oleh Tim Website Kelas X TKJ 3" />
                        </div>
                        <div className="admin-form-group">
                            <label>Waktu/Tanggal</label>
                            <input type="text" className="admin-input" value={formData.tanggal} onChange={(e) => setFormData({...formData, tanggal: e.target.value})} placeholder="Agustus 2025" />
                        </div>
                        <div className="admin-form-group">
                            <label>Foto/Sertifikat</label>
                            {formData.image_url && (
                                <img src={formData.image_url} alt="Preview" style={{ width: '100%', height: '150px', objectFit: 'contain', background: 'var(--surface-1)', borderRadius: '8px', marginBottom: '10px' }} />
                            )}
                            <label className="btn-secondary" style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer', padding: '10px' }}>
                                {uploading ? <Loader className="spin" size={16} /> : <Upload size={16} />}
                                {uploading ? 'Mengupload...' : 'Pilih Foto (Opsional)'}
                                <input type="file" accept="image/*" onChange={uploadImage} style={{ display: 'none' }} disabled={uploading} />
                            </label>
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={saving || uploading}>
                            {saving ? <Loader className="spin" size={16} /> : (isEditing ? <Edit size={16}/> : <Plus size={16} />)}
                            {saving ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Tambah Prestasi')}
                        </button>
                    </form>
                </div>

                <div className="admin-table-container glass-card" style={{ marginTop: 0 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', padding: '16px' }}>
                        {achievements.length === 0 ? (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>Belum ada prestasi</div>
                        ) : (
                            achievements.map(item => (
                                <div key={item.id} className="glass-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column' }}>
                                    {item.image_url && (
                                        <img src={item.image_url} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '4px', marginBottom: '12px' }} alt={item.judul} />
                                    )}
                                    <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>{item.judul}</h4>
                                    <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: 'var(--text-muted)', flex: 1 }}>{item.deskripsi}</p>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', marginBottom: '12px' }}>{item.tanggal}</div>
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                                        <button className="icon-btn" onClick={() => {setFormData(item); setIsEditing(true); window.scrollTo(0, 0)}}><Edit size={16} /></button>
                                        <button className="icon-btn text-danger" onClick={() => handleDelete(item.id, item.image_url)}><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
