import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import './About.css';

const STATS = [
  { label: 'Stack',    value: 'CS @ UCI',      suit: '♠' },
  { label: 'Year',     value: "'27",            suit: '♦' },
  { label: 'Buy-In',   value: 'Python · ML',   suit: '♥' },
  { label: 'Table',    value: 'Irvine, CA',     suit: '♣' },
];

const COURSEWORK = [
  'Data Structures', 'Algorithms', 'Machine Learning',
  'Information Retrieval', 'Software Engineering',
];

export default function About() {
  const [ref, inView] = useInView(0.15);

  return (
    <section id="about" className="about felt-bg">
      <div className="section-wrap">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="section-label">§ 01</p>
          <div className="suit-divider"><span aria-hidden="true">♠</span></div>

          <div className="about__layout">
            {/* Player card */}
            <div className="about__profile-card">
              <div className="about__card-header">
                <span className="about__card-suit" aria-hidden="true">♠</span>
                <span className="about__card-title">Player Profile</span>
                <span className="about__card-suit about__card-suit--red" aria-hidden="true">♥</span>
              </div>

              <div className="about__card-name">Maneet Shah</div>

              <div className="about__stats-grid" role="list">
                {STATS.map(({ label, value, suit }, i) => (
                  <motion.div
                    key={label}
                    className="about__stat"
                    role="listitem"
                    initial={{ opacity: 0, x: -12 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.07 }}
                  >
                    <span className="about__stat-suit" aria-hidden="true">{suit}</span>
                    <div>
                      <span className="about__stat-label">{label}</span>
                      <span className="about__stat-value">{value}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="about__card-footer">
                <span className="about__card-suit about__card-suit--red" aria-hidden="true">♦</span>
                <span className="about__card-suit" aria-hidden="true">♣</span>
              </div>
            </div>

            {/* Bio */}
            <div className="about__bio">
              <h2 className="about__heading">The Player</h2>

              <div className="about__open-signal" aria-label="Open to Summer 2026 Internships">
                <span className="about__open-dot" aria-hidden="true" />
                Open to Summer 2026 Internships — Data Engineering · ML · Full-Stack
              </div>

              <p className="about__text">
                I'm a CS junior at UC Irvine specializing in data systems and ML pipelines.
                I've built production semantic models at SharkNinja that hit ≥90% NL-to-SQL
                accuracy, shipped a full-stack search engine from scratch that indexes 55K+
                pages with sub-300ms query latency, and trained neural networks on real
                financial data for IPO prediction.
              </p>
              <p className="about__text">
                I'm looking for Summer 2026 internships in data engineering, ML, or
                full-stack. If you're building something interesting with data at scale,
                let's talk.
              </p>

              <div className="about__coursework">
                <p className="section-label" style={{ marginBottom: '0.75rem' }}>Coursework</p>
                <div className="about__courses" role="list">
                  {COURSEWORK.map((c) => (
                    <span key={c} className="about__course" role="listitem">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>


      </div>
    </section>
  );
}
