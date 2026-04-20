import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import './Projects.css';

const PROJECTS = [
  {
    rank: 'A♠',
    name: 'ICS Search Engine',
    tagline: 'Built from scratch. Sub-300ms queries.',
    suit: '♠',
    suitColor: 'black',
    description:
      'A full-featured search engine over UCI ICS web pages. Implements inverted indexing, tf-idf ranking, and PageRank scoring for relevance. Handles tens of thousands of documents with query latency under 300ms.',
    tech: ['Python', 'Inverted Index', 'tf-idf', 'PageRank', 'BeautifulSoup'],
    github: 'https://github.com/Maneetss/cs-121-Search-Engine',
    status: 'Live on GitHub',
  },
  {
    rank: 'K♦',
    name: 'IPO Listing Gain Predictor',
    tagline: 'End-to-end ML pipeline for IPO forecasting.',
    suit: '♦',
    suitColor: 'red',
    description:
      'Predicts IPO listing gains using deep learning. Implements a full ML pipeline from data ingestion and feature engineering to TensorFlow/Keras model training and evaluation. Targets retail investors seeking data-driven entry signals.',
    tech: ['Python', 'TensorFlow', 'Keras', 'Pandas', 'NumPy', 'Scikit-learn'],
    github: 'https://github.com/Maneetss/IPO-prediction',
    status: 'Live on GitHub',
  },
  {
    rank: 'Q♥',
    name: 'Credit Card Fraud Detector',
    tagline: 'Multi-model classification on imbalanced data.',
    suit: '♥',
    suitColor: 'red',
    description:
      'Tackles one of ML\'s hardest class-imbalance problems. Compares Random Forest, Logistic Regression, and XGBoost with SMOTE oversampling. Evaluated across precision, recall, and F1 to minimize false negatives on real transaction data.',
    tech: ['Python', 'scikit-learn', 'XGBoost', 'SMOTE', 'Pandas', 'Matplotlib'],
    github: null,
    status: 'Private Repo',
  },
];

export default function Projects() {
  const [ref, inView] = useInView(0.08);
  const [flipped, setFlipped] = useState(null);

  return (
    <section id="projects" className="projects">
      <div className="section-wrap">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="section-label">§ 04</p>
          <div className="suit-divider"><span aria-hidden="true">♣</span></div>
          <h2 className="proj__heading">The Bluffs</h2>
          <p className="section-sub">Featured projects</p>
          <p className="proj__sub">Three projects. Tap or hover each card to see what's face-down.</p>

          <div className="proj__grid" role="list">
            {PROJECTS.map((p, i) => (
              <motion.article
                key={p.name}
                className={`proj__card proj__card--${p.suitColor}${flipped === i ? ' proj__card--flipped' : ''}`}
                role="listitem"
                aria-label={p.name}
                aria-pressed={flipped === i}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                tabIndex={0}
                onClick={() => setFlipped(flipped === i ? null : i)}
                onKeyDown={(e) => e.key === 'Enter' && setFlipped(flipped === i ? null : i)}
              >
                {/* Front face */}
                <div className="proj__face proj__face--front">
                  <div className="proj__face-corner proj__face-corner--tl">
                    <span className="proj__face-rank">{p.rank}</span>
                  </div>
                  <div className="proj__face-center">
                    <span className="proj__face-suit" aria-hidden="true">{p.suit}</span>
                    <h3 className="proj__name">{p.name}</h3>
                    <p className="proj__tagline">{p.tagline}</p>
                  </div>
                  <div className="proj__face-hint">
                    <span aria-hidden="true">hover to reveal</span>
                  </div>
                  <div className="proj__face-corner proj__face-corner--br">
                    <span className="proj__face-rank">{p.rank}</span>
                  </div>
                </div>

                {/* Back face */}
                <div className="proj__face proj__face--back">
                  <div className="proj__back-header">
                    <span className="proj__back-suit" aria-hidden="true">{p.suit}</span>
                    <h3 className="proj__back-name">{p.name}</h3>
                  </div>
                  <p className="proj__description">{p.description}</p>
                  <div className="proj__tech-list" role="list" aria-label="Technologies used">
                    {p.tech.map((t) => (
                      <span key={t} className="proj__tech" role="listitem">{t}</span>
                    ))}
                  </div>
                  <div className="proj__actions">
                    {p.github ? (
                      <a
                        href={p.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{ fontSize: '0.68rem' }}
                        aria-label={`View ${p.name} on GitHub`}
                      >
                        <GitHubIcon /> View Code
                      </a>
                    ) : (
                      <span className="proj__private">
                        <LockIcon /> {p.status}
                      </span>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>


      </div>
    </section>
  );
}

function GitHubIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}
