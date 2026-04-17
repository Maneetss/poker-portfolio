import { motion } from 'framer-motion';
import { useInView } from '../hooks/useInView';
import './Skills.css';

const HAND = [
  {
    suit: '♠',
    suitColor: 'black',
    rank: 'A',
    label: 'Languages',
    items: ['Python', 'Java', 'C/C++', 'JavaScript', 'SQL', 'R', 'HTML/CSS', 'Assembly'],
  },
  {
    suit: '♥',
    suitColor: 'red',
    rank: 'K',
    label: 'Frameworks',
    items: ['React', 'TensorFlow', 'Keras', 'scikit-learn', 'Pandas', 'NumPy', 'Streamlit', 'Matplotlib'],
  },
  {
    suit: '♦',
    suitColor: 'red',
    rank: 'Q',
    label: 'Tools',
    items: ['Git / GitHub', 'Snowflake', 'GitHub Actions', 'Pytest', 'Figma', 'Makefile', 'Photoshop', 'Illustrator'],
  },
  {
    suit: '♣',
    suitColor: 'black',
    rank: 'J',
    label: 'Concepts',
    items: ['Agile', 'REST APIs', 'NL-to-SQL', 'Semantic Modeling', 'Inverted Indexing', 'tf-idf', 'Neural Networks', 'CI/CD'],
  },
];

export default function Skills() {
  const [ref, inView] = useInView(0.1);

  return (
    <section id="skills" className="skills">
      <div className="section-wrap">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="section-label">§ 02</p>
          <div className="suit-divider"><span aria-hidden="true">♥</span></div>

          <h2 className="skills__heading">The Hand</h2>
          <p className="skills__sub">Four suits. Each card shows the top picks — hover to see the full hand.</p>

          <div className="skills__hand" role="list">
            {HAND.map((card, i) => (
              <motion.div
                key={card.label}
                className={`skills__card skills__card--${card.suitColor}`}
                role="listitem"
                aria-label={`${card.label}: ${card.items.join(', ')}`}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                tabIndex={0}
              >
                <div className="skills__card-front">
                  <div className="skills__card-corner skills__card-corner--tl">
                    <span className="skills__rank">{card.rank}</span>
                    <span className="skills__suit-sm">{card.suit}</span>
                  </div>
                  <div className="skills__card-center">
                    <span className="skills__suit-lg" aria-hidden="true">{card.suit}</span>
                    <span className="skills__card-label">{card.label}</span>
                  </div>
                  {/* Top 3 always visible */}
                  <ul className="skills__preview" aria-label={`Top skills: ${card.items.slice(0,3).join(', ')}`}>
                    {card.items.slice(0, 3).map((item) => (
                      <li key={item} className="skills__preview-item">
                        <span aria-hidden="true">·</span>{item}
                      </li>
                    ))}
                    <li className="skills__preview-more" aria-label={`${card.items.length - 3} more on hover`}>
                      +{card.items.length - 3} more
                    </li>
                  </ul>
                  <div className="skills__card-corner skills__card-corner--br">
                    <span className="skills__rank">{card.rank}</span>
                    <span className="skills__suit-sm">{card.suit}</span>
                  </div>
                </div>
                <div className="skills__card-back" aria-hidden="true">
                  <div className="skills__back-header">
                    <span>{card.suit}</span>
                    <span className="skills__back-title">{card.label}</span>
                    <span>{card.suit}</span>
                  </div>
                  <ul className="skills__list">
                    {card.items.map((item) => (
                      <li key={item} className="skills__item">
                        <span className="skills__item-dot" aria-hidden="true">·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>


      </div>
    </section>
  );
}
