import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import MissionPipeline from './components/MissionPipeline'
import Features from './components/Features'
import DashboardPreview from './components/DashboardPreview'
import AICapabilities from './components/AICapabilities'
import HowItWorks from './components/HowItWorks'
import Testimonials from './components/Testimonials'
import CTA from './components/CTA'
import Footer from './components/Footer'

export default function App() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#030712]"
    >
      <Navbar />
      <Hero />
      <MissionPipeline />
      <Features />
      <DashboardPreview />
      <AICapabilities />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </motion.div>
  )
}
