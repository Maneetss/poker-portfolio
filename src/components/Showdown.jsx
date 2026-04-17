import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import PokerCard from './PokerCard';
import { usePokerHand } from '../context/PokerHandContext';
import './Showdown.css';

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function isBest(card, bestCards) {
  return bestCards.some(bc => bc.rank === card.rank && bc.suit === card.suit);
}

export default function Showdown() {
  const hand    = usePokerHand();
  const ref     = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (!hand) return null;

  const allCards = [...hand.holeCards, ...hand.flop, ...hand.turn, ...hand.river];

  return (
    <div ref={ref} className="showdown" aria-label="Poker hand showdown result">
      <div className="showdown__header">
        <span aria-hidden="true">♠</span>
        <span className="showdown__header-label">THE SHOWDOWN</span>
        <span aria-hidden="true">♠</span>
      </div>

      {/* All 7 cards */}
      <div className="showdown__cards">
        {allCards.map((card, i) => {
          const best = isBest(card, hand.bestCards);
          return (
            <div
              key={`${card.rank}${card.suit}-${i}`}
              className={`showdown__slot${inView ? ' showdown__slot--in' : ''}`}
              style={{ transitionDelay: prefersReduced ? '0ms' : `${i * 100}ms` }}
            >
              <PokerCard
                card={card}
                size="md"
                glowing={best}
                dimmed={!best}
              />
              {i === 1 && (
                <span className="showdown__divider" aria-hidden="true">|</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Hand name reveal */}
      <motion.div
        className="showdown__result"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: prefersReduced ? 0 : 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="showdown__hand-name">{hand.bestHand}</p>
        <p className="showdown__tagline">{hand.tagline}</p>
        <p className="showdown__refresh">
          Dealt fresh on every visit. Refresh to see a new hand.{' '}
          <span aria-hidden="true">♠</span>
        </p>
      </motion.div>
    </div>
  );
}
