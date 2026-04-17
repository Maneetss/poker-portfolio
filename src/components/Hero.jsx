import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './Hero.css';

// Cards now carry the skill label + suit info
const HAND = [
  { label: 'Python',      suit: '♠', isRed: false, rank: 'A' },
  { label: 'React',       suit: '♦', isRed: true,  rank: 'K' },
  { label: 'ML / AI',     suit: '♥', isRed: true,  rank: 'Q' },
  { label: 'Data',        suit: '♣', isRed: false,  rank: 'J' },
  { label: 'Full-Stack',  suit: '♠', isRed: false,  rank: '10' },
];

const STATS = [
  { value: '3',       label: 'Internships' },
  { value: '55K+',    label: 'Pages Indexed' },
  { value: '≥90%',    label: 'NL→SQL Accuracy' },
  { value: '<300ms',  label: 'Query Latency' },
];

export default function Hero() {
  const glowRef = useRef(null);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;
    const move = (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      el.style.setProperty('--gx', `${x}%`);
      el.style.setProperty('--gy', `${y}%`);
    };
    el.addEventListener('mousemove', move);
    return () => el.removeEventListener('mousemove', move);
  }, []);

  // wider spread + 40% larger cards
  const offsets = [-72, -36, 0, 36, 72];
  const rotates = [-13, -6, 0, 6, 13];

  return (
    <section id="hero" className="hero" ref={glowRef} aria-label="Hero">
      {/* Background decorative suits */}
      <div className="hero__bg-suits" aria-hidden="true">
        {['♠','♥','♦','♣','♠','♦','♣','♥'].map((s, i) => (
          <span key={i} className="hero__bg-suit">{s}</span>
        ))}
      </div>

      {/* Table rim light */}
      <div className="hero__table-rim" aria-hidden="true" />

      <div className="hero__inner">
        {/* Placard */}
        <motion.div
          className="hero__placard"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero__placard-top">
            <span className="hero__placard-suit" aria-hidden="true">♠</span>
            <span className="hero__placard-label">Now Seated</span>
            <span className="hero__placard-suit hero__placard-suit--red" aria-hidden="true">♥</span>
          </div>
          <h1 className="hero__name">Maneet Shah</h1>
          <div className="hero__placard-bottom">
            <span className="hero__placard-suit hero__placard-suit--red" aria-hidden="true">♦</span>
            <span className="hero__placard-label">Irvine, CA · UCI &rsquo;27</span>
            <span className="hero__placard-suit" aria-hidden="true">♣</span>
          </div>
        </motion.div>

        {/* Open-to-work badge */}
        <motion.div
          className="hero__open-badge"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          aria-label="Open to Summer 2026 Internships"
        >
          <span className="hero__open-dot" aria-hidden="true" />
          Open to Summer 2026 Internships
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="hero__headline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          The House Always Needs Good Engineers.
        </motion.p>

        {/* Dealt-in chips */}
        <motion.div
          className="hero__hand-label"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          aria-label="Skills: Python, ML, Full-Stack"
        >
          <span className="hero__hand-prefix">Dealt In:</span>
          {['Python', 'ML', 'Full-Stack'].map((w, i) => (
            <motion.span
              key={w}
              className="hero__chip"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
            >
              {w}
            </motion.span>
          ))}
        </motion.div>

        {/* Stat badges */}
        <motion.div
          className="hero__stats"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          aria-label="Key metrics"
        >
          {STATS.map(({ value, label }) => (
            <div key={label} className="hero__stat">
              <span className="hero__stat-value">{value}</span>
              <span className="hero__stat-label">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Card hand — larger + wider spread */}
        <motion.div
          className="hero__cards"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
        >
          {HAND.map((card, i) => (
            <div
              key={card.label}
              className="hero__card"
              style={{
                '--tx': `${offsets[i]}px`,
                '--ry': `${rotates[i]}deg`,
                '--delay': `${1.05 + i * 0.08}s`,
              }}
              data-red={card.isRed || undefined}
            >
              <span className="hero__card-corner hero__card-corner--tl">
                <span className="hero__card-rank">{card.rank}</span>
                <span className="hero__card-suit-sm">{card.suit}</span>
              </span>
              <span className="hero__card-skill">{card.label}</span>
              <span className="hero__card-corner hero__card-corner--br">
                <span className="hero__card-rank">{card.rank}</span>
                <span className="hero__card-suit-sm">{card.suit}</span>
              </span>
            </div>
          ))}
        </motion.div>

        {/* CTAs — GitHub, LinkedIn, Contact */}
        <motion.div
          className="hero__cta"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
        >
          <a
            href="https://github.com/Maneetss"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            aria-label="View GitHub profile"
          >
            <GitHubIcon /> GitHub
          </a>
          <a
            href="https://linkedin.com/in/maneetshah"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            aria-label="View LinkedIn profile"
          >
            <LinkedInIcon /> LinkedIn
          </a>
          <a href="#contact" className="btn btn-outline">
            <span aria-hidden="true">♣</span> Contact
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="hero__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        aria-hidden="true"
      >
        <span className="hero__scroll-text">Scroll</span>
        <div className="hero__scroll-line" />
      </motion.div>
    </section>
  );
}

function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  );
}
function LinkedInIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}
