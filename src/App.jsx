import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import LoadingSpinner from './components/LoadingSpinner';
import PageTransition from './components/PageTransition';
import ScrollProgress from './components/ScrollProgress';
import BackButton from './components/BackButton';

// Lazy load components
const Home = lazy(() => import('./components/Home'));
const About = lazy(() => import('./components/About'));
const Skills = lazy(() => import('./components/Skills'));
const Projects = lazy(() => import('./components/Projects'));
const Certificates = lazy(() => import('./components/Certificates'));
const Contact = lazy(() => import('./components/Contact'));

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode='wait'>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition>
            <Home />
          </PageTransition>
        } />
        <Route path="/about" element={
          <PageTransition>
            <BackButton />
            <About />
          </PageTransition>
        } />
        <Route path="/skills" element={
          <PageTransition>
            <BackButton />
            <Skills />
          </PageTransition>
        } />
        <Route path="/experiences" element={
          <PageTransition>
            <BackButton />
            <Projects />
          </PageTransition>
        } />
        <Route path="/certificates" element={
          <PageTransition>
            <BackButton />
            <Certificates />
          </PageTransition>
        } />
        <Route path="/contact" element={
          <PageTransition>
            <BackButton />
            <Contact />
          </PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
        <div className="min-h-screen bg-gray-100 dark:bg-slate-950 transition-colors duration-200 flex flex-col">
        <ScrollProgress />
        <Navbar />
        <main className="flex-grow relative">
          <Suspense fallback={<LoadingSpinner />}>
            <AnimatedRoutes />
          </Suspense>
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </Router>
  );
}

export default App;
