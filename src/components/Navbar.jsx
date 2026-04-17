import { useState, useEffect } from 'react';
import './Navbar.css';

const NAV_ITEMS = [
  { label: 'The Player',  href: '#about',      suit: '♠' },
  { label: 'The Hand',    href: '#skills',     suit: '♥' },
  { label: 'The Table',   href: '#experience', suit: '♦' },
  { label: 'The Bluffs',  href: '#projects',   suit: '♣' },
  { label: 'Cash Out',    href: '#contact',    suit: '♠' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive]     = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* close mobile menu on resize */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* intersection observer for active section */
  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActive('#' + e.target.id); });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const handleLink = (href) => {
    setMenuOpen(false);
    setActive(href);
  };

  return (
    <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`} aria-label="Main navigation">
      <a href="#hero" className="navbar__logo" aria-label="Back to top">
        <span className="navbar__logo-suit" aria-hidden="true">♠</span>
        <span className="navbar__logo-text">Maneet Shah</span>
      </a>

      {/* Desktop links */}
      <ul className="navbar__links" role="list">
        {NAV_ITEMS.map(({ label, href, suit }) => (
          <li key={href}>
            <a
              href={href}
              className={`navbar__link${active === href ? ' navbar__link--active' : ''}`}
              onClick={() => handleLink(href)}
              aria-current={active === href ? 'page' : undefined}
            >
              <span className="navbar__link-suit" aria-hidden="true">{suit}</span>
              {label}
            </a>
          </li>
        ))}
      </ul>

      {/* Mobile hamburger */}
      <button
        className={`navbar__burger${menuOpen ? ' navbar__burger--open' : ''}`}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(v => !v)}
      >
        <span /><span /><span />
      </button>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="navbar__mobile" role="dialog" aria-label="Mobile navigation">
          {NAV_ITEMS.map(({ label, href, suit }) => (
            <a
              key={href}
              href={href}
              className={`navbar__mobile-link${active === href ? ' navbar__mobile-link--active' : ''}`}
              onClick={() => handleLink(href)}
            >
              <span aria-hidden="true">{suit}</span> {label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
