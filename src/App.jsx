import { useEffect } from 'react';
import './App.css';
import { PokerHandProvider }   from './context/PokerHandContext';
import { TablePanelProvider, useTablePanel } from './context/TablePanelContext';
import Navbar      from './components/Navbar';
import Hero        from './components/Hero';
import About       from './components/About';
import Skills      from './components/Skills';
import Experience  from './components/Experience';
import Projects    from './components/Projects';
import Contact     from './components/Contact';
import TablePanel  from './components/TablePanel';

/* Syncs --panel-offset CSS custom property so navbar + main can shift */
function PanelOffsetSyncer() {
  const { open } = useTablePanel();
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const offset   = open && !isMobile ? '480px' : '0px';
    document.documentElement.style.setProperty('--panel-offset', offset);
  }, [open]);
  return null;
}

export default function App() {
  return (
    <PokerHandProvider>
      <TablePanelProvider>
        <PanelOffsetSyncer />
        <a href="#main" className="sr-only">Skip to content</a>
        <Navbar />
        <main id="main">
          <Hero />
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Contact />
        </main>
        <TablePanel />
      </TablePanelProvider>
    </PokerHandProvider>
  );
}
