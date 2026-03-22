import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Loader, Trash2, Plus, Edit, X, FileText, File, FileSpreadsheet } from 'lucide-react'

export default function AdminDocuments() {
    const [documents, setDocuments] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    
    const [formData, setFormData] = useState({ id: null, nama_file: '', tipe: 'PDF', url_dokumen: '', deskripsi: '' })

    useEffect(() => { fetchDocuments() }, [])

    const fetchDocuments = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase.from('dokumen').select('*').order('created_at', { ascending: false })
            if (error) throw error
            setDocuments(data)
        } catch (error) {
            console.error('Error:', error)
            alert('Gagal mengambil data dokumen')
        } finally { setLoading(false) }
    }

    const resetForm = () => { setFormData({ id: null, nama_file: '', tipe: 'PDF', url_dokumen: '', deskripsi: '' }); setIsEditing(false) }

    const handleDelete = async (id) => {
        if (!window.confirm('Yakin ingin menghapus dokumen ini?')) return
        try {
            const { error } = await supabase.from('dokumen').delete().eq('id', id)
            if (error) throw error
            setDocuments(prev => prev.filter(d => d.id !== id))
        } catch (error) {
            console.error('Error:', error)
            alert('Gagal menghapus dokumen')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setSaving(true)
            if (isEditing) {
                const { error } = await supabase.from('dokumen').update({ ...formData }).eq('id', formData.id)
                if (error) throw error
            } else {
                const { id, ...insertData } = formData
                const { error } = await supabase.from('dokumen').insert([insertData])
                if (error) throw error
            }
            await fetchDocuments()
            resetForm()
            alert(isEditing ? 'Dokumen diperbarui!' : 'Dokumen ditambahkan!')
        } catch (error) {
            console.error('Error:', error)
            alert('Gagal menyimpan dokumen')
        } finally { setSaving(false) }
    }

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader className="spin" size={32} /></div>

    return (
        <div>
            <div className="admin-page-header">
                <div>
                    <h1>Kelola Dokumen & Kas</h1>
                    <p>Simpan link file penting kelas seperti PDF Struktur, Excel Kas, dll</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '24px', alignItems: 'start' }}>
                <div className="glass-card" style={{ padding: '24px', position: 'sticky', top: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3>{isEditing ? 'Edit Dokumen' : 'Tambah Dokumen'}</h3>
                        {isEditing && <button className="icon-btn text-danger" onClick={resetForm}><X size={16} /></button>}
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="admin-form-group">
                            <label>Nama File</label>
                            <input type="text" className="admin-input" value={formData.nama_file} onChange={(e) => setFormData({...formData, nama_file: e.target.value})} required placeholder="Cth: Laporan Kas Bulan Januari" />
                        </div>
                        <div className="admin-form-group">
                            <label>Tipe File</label>
                            <select className="admin-input" value={formData.tipe} onChange={(e) => setFormData({...formData, tipe: e.target.value})} required>
                                <option value="PDF">PDF / Dokumen Teks</option>
                                <option value="DOCX">Word (DOCX)</option>
                                <option value="XLSX">Excel / Spreadsheet</option>
                                <option value="PPT">PowerPoint</option>
                                <option value="LINK">Link Biasa</option>
                            </select>
                        </div>
                        <div className="admin-form-group">
                            <label>Link / URL File (Google Drive dll)</label>
                            <input type="url" className="admin-input" value={formData.url_dokumen} onChange={(e) => setFormData({...formData, url_dokumen: e.target.value})} required placeholder="https://..." />
                        </div>
                        <div className="admin-form-group">
                            <label>Deskripsi Singkat</label>
                            <textarea className="admin-textarea" value={formData.deskripsi} onChange={(e) => setFormData({...formData, deskripsi: e.target.value})} placeholder="Penjelasan singkat tentang isi dokumen..." />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={saving}>
                            {saving ? <Loader className="spin" size={16} /> : (isEditing ? <Edit size={16}/> : <Plus size={16} />)}
                            {saving ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Tambah Dokumen')}
                        </button>
                    </form>
                </div>

                <div className="admin-table-container glass-card" style={{ marginTop: 0 }}>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>File</th>
                                <th>Link</th>
                                <th width="100px" style={{ textAlign: 'center' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.length === 0 ? (
                                <tr><td colSpan="3" style={{ textAlign: 'center', padding: '24px' }}>Belum ada dokumen</td></tr>
                            ) : (
                                documents.map(item => (
                                    <tr key={item.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ color: item.tipe === 'PDF' ? '#ef4444' : item.tipe === 'XLSX' ? '#10b981' : '#3b82f6' }}>
                                                    {item.tipe === 'PDF' ? <FileText size={24} /> : item.tipe === 'XLSX' ? <FileSpreadsheet size={24} /> : <File size={24} />}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>{item.nama_file} <span className="badge badge-info">{item.tipe}</span></div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.deskripsi}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td><a href={item.url_dokumen} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', wordBreak: 'break-all' }}>Buka Link</a></td>
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
