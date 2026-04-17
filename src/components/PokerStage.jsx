import { useEffect, useRef, useState } from 'react';
import PokerCard from './PokerCard';
import { usePokerHand } from '../context/PokerHandContext';
import './PokerStage.css';

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const STAGES = {
  hole:  { label: 'YOUR HOLE CARDS', caption: 'Your hand. Only you know what you\'re holding.', pos: 'left' },
  flop:  { label: 'THE FLOP',        caption: 'Three cards. The board opens.',                  pos: 'right' },
  turn:  { label: 'THE TURN',        caption: 'One more. The odds shift.',                      pos: 'right' },
  river: { label: 'THE RIVER',       caption: 'Final card. The hand is set.',                   pos: 'right' },
  board: { label: 'THE BOARD',       caption: 'All cards on the table.',                        pos: 'right' },
};

function isBestCard(card, bestCards) {
  return bestCards.some(bc => bc.rank === card.rank && bc.suit === card.suit);
}

export default function PokerStage({ stage }) {
  const hand   = usePokerHand();
  const ref    = useRef(null);
  const [shown, setShown] = useState(0); // how many cards have animated in

  const cfg = STAGES[stage];

  // For hole cards: always visible, flip handled by PokerCard internally
  // For everything else: viewport-triggered stagger
  const isHole = stage === 'hole';

  useEffect(() => {
    if (isHole) {
      setShown(2); // both hole cards present immediately (face-down, flip via PokerCard)
      return;
    }

    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const cards = getCards();
        if (prefersReduced) { setShown(cards.length); return; }
        let i = 0;
        const iv = setInterval(() => {
          i++;
          setShown(i);
          if (i >= cards.length) clearInterval(iv);
        }, 200);
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [stage]); // eslint-disable-line

  if (!hand) return null;

  function getCards() {
    if (stage === 'board') return [...hand.flop, ...hand.turn, ...hand.river];
    return hand[stage === 'hole' ? 'holeCards' : stage] || [];
  }

  const cards = getCards();

  return (
    <div
      ref={ref}
      className={`pstage pstage--${cfg.pos}`}
      aria-label={`Poker stage: ${cfg.label}`}
    >
      <span className="pstage__label">{cfg.label}</span>
      <div className="pstage__cards">
        {cards.map((card, i) => {
          const visible = i < shown;
          const glowing = stage === 'board' && isBestCard(card, hand.bestCards);
          return (
            <div
              key={`${card.rank}${card.suit}-${i}`}
              className={`pstage__slot${visible ? ' pstage__slot--in' : ''}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <PokerCard
                card={card}
                faceDown={isHole}
                flipDelay={isHole ? 1000 + i * 200 : 0}
                size="sm"
                glowing={glowing}
              />
            </div>
          );
        })}
      </div>
      <p className="pstage__caption">{cfg.caption}</p>
    </div>
  );
}
