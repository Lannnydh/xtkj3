import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Loader, Trash2, Check, X, MessageSquare } from 'lucide-react'

export default function AdminConfess() {
    const [confessions, setConfessions] = useState([])
    const [loading, setLoading] = useState(true)
    const [processingId, setProcessingId] = useState(null)
    const [replyingId, setReplyingId] = useState(null)
    const [replyText, setReplyText] = useState('')

    useEffect(() => { fetchConfessions() }, [])

    const fetchConfessions = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase.from('confess').select('*').order('created_at', { ascending: false })
            if (error) throw error
            setConfessions(data)
        } catch (error) {
            console.error('Error fetching confess:', error)
            alert('Gagal mengambil data confess')
        } finally { setLoading(false) }
    }

    const updateStatus = async (id, status) => {
        try {
            setProcessingId(id)
            const { error } = await supabase.from('confess').update({ status }).eq('id', id)
            if (error) throw error
            setConfessions(prev => prev.map(c => c.id === id ? { ...c, status } : c))
        } catch (error) {
            alert('Gagal update status')
        } finally { setProcessingId(null) }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Yakin hapus confess ini?')) return
        try {
            setProcessingId(id)
            const { error } = await supabase.from('confess').delete().eq('id', id)
            if (error) throw error
            setConfessions(prev => prev.filter(c => c.id !== id))
        } catch (error) {
            alert('Gagal menghapus confess')
        } finally { setProcessingId(null) }
    }

    const handleReply = async (id) => {
        try {
            setProcessingId(id)
            const { error } = await supabase.from('confess').update({ balasan: replyText }).eq('id', id)
            if (error) throw error
            setConfessions(prev => prev.map(c => c.id === id ? { ...c, balasan: replyText } : c))
            setReplyingId(null)
            setReplyText('')
        } catch (error) {
            alert('Gagal membalas confess')
        } finally { setProcessingId(null) }
    }

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader className="spin" size={32} /></div>

    return (
        <div>
            <div className="admin-page-header">
                <div>
                    <h1>Kelola Confess / Menfess</h1>
                    <p>Approve confess agar tampil di web utama, atau berikan balasan admin</p>
                </div>
            </div>

            <div style={{ display: 'grid', gap: '16px' }}>
                {confessions.length === 0 ? (
                    <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>Belum ada confess masuk</div>
                ) : (
                    confessions.map(item => (
                        <div key={item.id} className="glass-card" style={{ padding: '20px', borderLeft: item.status === 'pending' ? '4px solid var(--warning)' : item.status === 'approved' ? '4px solid var(--success)' : '4px solid var(--danger)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Dari: {item.pengirim}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(item.created_at).toLocaleString('id-ID')}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <span className={`badge ${item.status === 'approved' ? 'badge-success' : item.status === 'rejected' ? 'badge-warning' : 'badge-info'}`}>
                                        {item.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            
                            <p style={{ background: 'var(--surface-2)', padding: '16px', borderRadius: '8px', marginBottom: '16px', fontStyle: 'italic' }}>
                                "{item.pesan}"
                            </p>

                            {item.balasan && (
                                <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid var(--accent-primary)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                                    <strong>Admin Reply:</strong>
                                    <p style={{ margin: '8px 0 0 0' }}>{item.balasan}</p>
                                </div>
                            )}

                            {replyingId === item.id ? (
                                <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                                    <input type="text" className="admin-input" placeholder="Tulis balasan..." value={replyText} onChange={e => setReplyText(e.target.value)} />
                                    <button className="btn-primary" onClick={() => handleReply(item.id)} disabled={processingId === item.id}>Kirim</button>
                                    <button className="btn-secondary" onClick={() => {setReplyingId(null); setReplyText('')}}>Batal</button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {item.status !== 'approved' && (
                                        <button className="btn-secondary" style={{ color: 'var(--success)' }} onClick={() => updateStatus(item.id, 'approved')} disabled={processingId === item.id}>
                                            <Check size={16} /> Approve
                                        </button>
                                    )}
                                    {item.status !== 'rejected' && item.status !== 'pending' && (
                                        <button className="btn-secondary" style={{ color: 'var(--warning)' }} onClick={() => updateStatus(item.id, 'rejected')} disabled={processingId === item.id}>
                                            <X size={16} /> Reject/Sembunyikan
                                        </button>
                                    )}
                                    <button className="btn-secondary" onClick={() => {setReplyingId(item.id); setReplyText(item.balasan || '')}}>
                                        <MessageSquare size={16} /> Balas
                                    </button>
                                    <button className="icon-btn text-danger" style={{ background: 'var(--surface-3)', padding: '8px 16px', borderRadius: '8px' }} onClick={() => handleDelete(item.id)} disabled={processingId === item.id}>
                                        <Trash2 size={16} /> Hapus Permanen
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
