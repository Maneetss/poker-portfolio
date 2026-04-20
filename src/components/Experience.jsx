import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import './Experience.css';

const ROUNDS = [
  {
    round: 'Round III',
    suit: '♠',
    role: 'Data Analytics Intern',
    company: 'SharkNinja',
    period: 'Jul – Aug 2025',
    chips: ['Snowflake', 'Streamlit', 'NL-to-SQL', 'Semantic Modeling'],
    bullets: [
      'Deployed Snowflake Cortex Analyst to enable natural language queries over enterprise data warehouses.',
      'Built semantic data models achieving ≥90% NL-to-SQL accuracy across 12+ business entities.',
      'Shipped an interactive Streamlit demo used by stakeholders to validate query intent in real time.',
    ],
  },
  {
    round: 'Round II',
    suit: '♦',
    role: 'Data Intern',
    company: 'AdvaMed Association',
    period: 'Jun – Aug 2024',
    chips: ['Python', 'Forecasting', 'Pandas', 'Billing Analysis'],
    bullets: [
      'Built a Python-based forecasting model to project membership billing trends across quarterly cycles.',
      'Analyzed multi-year billing data to identify anomalies and surface actionable revenue insights.',
    ],
  },
  {
    round: 'Round I',
    suit: '♣',
    role: 'QA Intern',
    company: 'ByPeople Technologies',
    period: 'May – Sep 2023',
    chips: ['Black-box Testing', 'White-box Testing', 'Gray-box Testing', 'Bug Reporting'],
    bullets: [
      'Executed black, white, and gray-box testing for a food delivery mobile application.',
      'Documented and tracked defects through full lifecycle, reducing critical bug escape rate.',
    ],
  },
];

export default function Experience() {
  const [ref, inView] = useInView(0.08);

  return (
    <section id="experience" className="experience felt-bg">
      <div className="section-wrap">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="section-label">§ 03</p>
          <div className="suit-divider"><span aria-hidden="true">♦</span></div>
          <h2 className="exp__heading">The Table</h2>
          <p className="section-sub">Work experience</p>
          <p className="exp__sub">Previous hands played. Each round dealt something new.</p>

          <div className="exp__timeline">
            {ROUNDS.map((r, i) => (
              <motion.div
                key={r.company}
                className="exp__item"
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.15 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Timeline spine */}
                <div className="exp__spine" aria-hidden="true">
                  <div className="exp__chip-marker">
                    <span className="exp__chip-suit">{r.suit}</span>
                  </div>
                  {i < ROUNDS.length - 1 && <div className="exp__spine-line" />}
                </div>

                {/* Content */}
                <div className="exp__content">
                  <div className="exp__meta">
                    <span className="exp__round">{r.round}</span>
                    <span className="exp__period">{r.period}</span>
                  </div>
                  <h3 className="exp__role">{r.role}</h3>
                  <p className="exp__company">{r.company}</p>

                  <ul className="exp__bullets">
                    {r.bullets.map((b) => (
                      <li key={b} className="exp__bullet">
                        <span className="exp__bullet-dot" aria-hidden="true">♦</span>
                        {b}
                      </li>
                    ))}
                  </ul>

                  <div className="exp__chips" role="list" aria-label="Technologies">
                    {r.chips.map((c) => (
                      <span key={c} className="exp__tech" role="listitem">{c}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>


      </div>
    </section>
  );
}
