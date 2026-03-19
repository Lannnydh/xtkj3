import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Shield, Mail, Lock, LogIn, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import PageTransition from '../components/PageTransition'
import './Login.css'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { signIn } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const { error: signInError } = await signIn({ email, password })
            if (signInError) throw signInError
            
            navigate('/admin', { replace: true })
        } catch (err) {
            setError(err.message || 'Gagal login. Periksa email dan password Anda.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <PageTransition>
            <div className="login-container">
                <div className="login-wrapper">
                    <motion.div 
                        className="login-card glass-card"
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
                    >
                        <div className="login-header">
                            <motion.div 
                                className="login-icon"
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <Shield size={32} />
                            </motion.div>
                            <h2>Admin Login</h2>
                            <p>Silakan masuk menggunakan akun admin Anda</p>
                        </div>

                        {error && (
                            <motion.div 
                                className="login-error"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                            >
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="input-group">
                                <label>Email</label>
                                <div className="input-wrapper">
                                    <Mail size={18} className="input-icon" />
                                    <input 
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@xtkj3.com"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="input-group">
                                <label>Password</label>
                                <div className="input-wrapper">
                                    <Lock size={18} className="input-icon" />
                                    <input 
                                        type="password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <motion.button 
                                type="submit" 
                                className="btn-primary login-btn"
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {loading ? 'Memeriksa...' : (
                                    <>
                                        <LogIn size={18} />
                                        Masuk ke Dashboard
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </PageTransition>
    )
}
