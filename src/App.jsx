import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Announcements from './pages/Announcements'
import Schedule from './pages/Schedule'
import Members from './pages/Members'
import Gallery from './pages/Gallery'
import Tasks from './pages/Tasks'
import Documents from './pages/Documents'
import Achievements from './pages/Achievements'
import Confess from './pages/Confess'
import Contact from './pages/Contact'

function App() {
  const location = useLocation()

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/members" element={<Members />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/confess" element={<Confess />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  )
}

export default App
