import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Capabilities from './components/Capabilities'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Education from './components/Education'
import Contact from './components/Contact'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      {/* Fixed decorative background: raining letters + gradient glows */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-base">
      </div>

      <Navbar />
      <main>
        <Hero />
        <Capabilities />
        <Projects />
        <Experience />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}
