import './ThemeToggle.css'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Stars } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme()
    const isDark = theme === 'dark'

    return (
        <motion.button
            className="theme-toggle"
            onClick={toggleTheme}
            whileHover={{ scale: 1.2, rotate: 15 }}
            whileTap={{ scale: 0.85, rotate: -15 }}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            <AnimatePresence mode="wait">
                {isDark ? (
                    <motion.div
                        key="moon"
                        initial={{ opacity: 0, rotate: -180, scale: 0 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: 180, scale: 0 }}
                        transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
                        className="toggle-icon"
                    >
                        <Moon size={18} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="sun"
                        initial={{ opacity: 0, rotate: 180, scale: 0 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: -180, scale: 0 }}
                        transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
                        className="toggle-icon"
                    >
                        <Sun size={18} />
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="toggle-glow" />
            <div className="toggle-ring" />
        </motion.button>
    )
}
