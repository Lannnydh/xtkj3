import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Loader, Trash2, Plus, Edit, X, Upload } from 'lucide-react'

export default function AdminGallery() {
    const [gallery, setGallery] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [uploading, setUploading] = useState(false)
    
    const [formData, setFormData] = useState({ id: null, image_url: '', caption: '' })

    useEffect(() => { fetchGallery() }, [])

    const fetchGallery = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase.from('galeri').select('*').order('created_at', { ascending: false })
            if (error) throw error
            setGallery(data)
        } catch (error) {
            console.error('Error:', error)
            alert('Gagal mengambil data galeri')
        } finally { setLoading(false) }
    }

    const resetForm = () => { setFormData({ id: null, image_url: '', caption: '' }); setIsEditing(false) }

    const handleDelete = async (id, image_url) => {
        if (!window.confirm('Yakin ingin menghapus foto ini?')) return
        try {
            if (image_url) {
                const fileName = image_url.split('/').pop()
                if (fileName) await supabase.storage.from('kelas_images').remove([`gallery/${fileName}`])
            }
            const { error } = await supabase.from('galeri').delete().eq('id', id)
            if (error) throw error
            setGallery(prev => prev.filter(g => g.id !== id))
        } catch (error) {
            console.error('Error:', error)
            alert('Gagal menghapus foto')
        }
    }

    const uploadImage = async (event) => {
        try {
            setUploading(true)
            const file = event.target.files[0]
            if (!file) return

            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `gallery/${fileName}`

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
        if (!formData.image_url) return alert('Pilih foto terlebih dahulu!')
        try {
            setSaving(true)
            if (isEditing) {
                const { error } = await supabase.from('galeri').update({ image_url: formData.image_url, caption: formData.caption }).eq('id', formData.id)
                if (error) throw error
            } else {
                const { error } = await supabase.from('galeri').insert([{ image_url: formData.image_url, caption: formData.caption }])
                if (error) throw error
            }
            await fetchGallery()
            resetForm()
            alert(isEditing ? 'Foto diperbarui!' : 'Foto ditambahkan!')
        } catch (error) {
            console.error('Error:', error)
            alert('Gagal menyimpan foto')
        } finally { setSaving(false) }
    }

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader className="spin" size={32} /></div>

    return (
        <div>
            <div className="admin-page-header">
                <div>
                    <h1>Kelola Galeri</h1>
                    <p>Upload foto momen kelas ke galeri</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '24px', alignItems: 'start' }}>
                <div className="glass-card" style={{ padding: '24px', position: 'sticky', top: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3>{isEditing ? 'Edit Foto' : 'Upload Foto'}</h3>
                        {isEditing && <button className="icon-btn text-danger" onClick={resetForm}><X size={16} /></button>}
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="admin-form-group">
                            <label>Foto Momen</label>
                            {formData.image_url && (
                                <img src={formData.image_url} alt="Preview" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} />
                            )}
                            <label className="btn-secondary" style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer', padding: '10px' }}>
                                {uploading ? <Loader className="spin" size={16} /> : <Upload size={16} />}
                                {uploading ? 'Mengupload...' : (formData.image_url ? 'Ganti Foto' : 'Pilih Foto')}
                                <input type="file" accept="image/*" onChange={uploadImage} style={{ display: 'none' }} disabled={uploading} />
                            </label>
                        </div>
                        <div className="admin-form-group">
                            <label>Caption / Keterangan</label>
                            <textarea className="admin-textarea" value={formData.caption} onChange={(e) => setFormData({...formData, caption: e.target.value})} placeholder="Contoh: Keseruan classmeeting basket 2025" required />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={saving || uploading || !formData.image_url}>
                            {saving ? <Loader className="spin" size={16} /> : (isEditing ? <Edit size={16}/> : <Plus size={16} />)}
                            {saving ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Upload ke Galeri')}
                        </button>
                    </form>
                </div>

                <div className="admin-table-container glass-card" style={{ marginTop: 0 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px', padding: '16px' }}>
                        {gallery.length === 0 ? (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>Belum ada foto galeri</div>
                        ) : (
                            gallery.map(item => (
                                <div key={item.id} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--surface-3)' }}>
                                    <img src={item.image_url} alt={item.caption} style={{ width: '100%', height: '150px', objectFit: 'cover', display: 'block' }} />
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.7)', padding: '8px', boxSizing: 'border-box' }}>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.caption}</p>
                                    </div>
                                    <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px' }}>
                                        <button className="icon-btn" style={{ background: 'var(--surface-1)', padding: '4px' }} onClick={() => {setFormData(item); setIsEditing(true); window.scrollTo(0, 0)}}><Edit size={14} /></button>
                                        <button className="icon-btn text-danger" style={{ background: 'var(--surface-1)', padding: '4px' }} onClick={() => handleDelete(item.id, item.image_url)}><Trash2 size={14} /></button>
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
