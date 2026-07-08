import Navbar from './components/Navbar'
import RainingLetters from './components/RainingLetters'
import Hero from './components/Hero'
import Capabilities from './components/Capabilities'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Education from './components/Education'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      {/* Fixed decorative background: raining letters + gradient glows */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-base">
        <RainingLetters count={150} />
        <div className="absolute -top-40 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-accent/20 blur-[130px]" />
        <div className="absolute top-[10%] -right-40 h-[32rem] w-[32rem] rounded-full bg-accent-blue/10 blur-[120px]" />
        <div className="absolute bottom-0 -left-40 h-[32rem] w-[32rem] rounded-full bg-accent-cyan/10 blur-[120px]" />
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
    </div>
  )
}
