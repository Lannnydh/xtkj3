import { motion } from 'framer-motion'

const pageVariants = {
    initial: { opacity: 0, y: 30, scale: 0.98 },
    animate: {
        opacity: 1, y: 0, scale: 1,
        transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
    },
    exit: {
        opacity: 0, y: -20, scale: 0.98,
        transition: { duration: 0.3 }
    }
}

export default function PageTransition({ children }) {
    return (
        <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
            {children}
        </motion.div>
    )
}

export const staggerContainer = {
    animate: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } }
}

export const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } }
}

export const fadeInLeft = {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } }
}

export const fadeInRight = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } }
}

export const scaleIn = {
    initial: { opacity: 0, scale: 0.85 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.4, type: 'spring', stiffness: 200 } }
}

export const popIn = {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.4, type: 'spring', stiffness: 300, damping: 15 } }
}

export const slideInLeft = {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.6, type: 'spring', stiffness: 100 } }
}

export const slideInRight = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.6, type: 'spring', stiffness: 100 } }
}

export const rotateIn = {
    initial: { opacity: 0, rotate: -10, scale: 0.9 },
    animate: { opacity: 1, rotate: 0, scale: 1, transition: { duration: 0.5, type: 'spring' } }
}

export const bounceIn = {
    initial: { opacity: 0, y: 50, scale: 0.8 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, type: 'spring', stiffness: 400, damping: 12 } }
}

export const flipIn = {
    initial: { opacity: 0, rotateY: 90 },
    animate: { opacity: 1, rotateY: 0, transition: { duration: 0.6 } }
}
