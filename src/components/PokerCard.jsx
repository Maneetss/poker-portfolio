import { useEffect, useState } from 'react';
import './PokerCard.css';

const RED_SUITS = new Set(['♥', '♦']);

// Detect reduced-motion once at module level (safe in browser)
const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function PokerCard({
  card,
  faceDown  = false,
  size      = 'sm',   // 'sm' | 'md' | 'lg'
  glowing   = false,
  dimmed    = false,
  flipDelay = 0,      // ms before face-down card auto-flips
}) {
  // If prefers-reduced-motion, start revealed immediately
  const [revealed, setRevealed] = useState(!faceDown || prefersReduced);

  useEffect(() => {
    if (!faceDown || prefersReduced) return;
    const id = setTimeout(() => setRevealed(true), flipDelay);
    return () => clearTimeout(id);
  }, [faceDown, flipDelay]); // eslint-disable-line

  const isRed = card && RED_SUITS.has(card.suit);

  return (
    <div
      className={[
        'pcard',
        `pcard--${size}`,
        glowing ? 'pcard--glowing' : '',
        dimmed  ? 'pcard--dimmed'  : '',
      ].filter(Boolean).join(' ')}
      role="img"
      aria-label={revealed && card ? `${card.rank} of ${card.suit}` : 'face-down card'}
    >
      <div className={`pcard__inner${revealed ? ' pcard__inner--revealed' : ''}`}>
        {/* Back face */}
        <div className="pcard__back" aria-hidden="true">
          <span className="pcard__monogram">M<span className="pcard__mono-suit">♠</span>S</span>
        </div>

        {/* Front face */}
        <div className={`pcard__front${isRed ? ' pcard__front--red' : ''}`} aria-hidden={!revealed}>
          {card && (
            <>
              <span className="pcard__corner pcard__corner--tl">
                <span className="pcard__rank">{card.rank}</span>
                <span className="pcard__suit-sm">{card.suit}</span>
              </span>
              <span className="pcard__suit-lg">{card.suit}</span>
              <span className="pcard__corner pcard__corner--br">
                <span className="pcard__rank">{card.rank}</span>
                <span className="pcard__suit-sm">{card.suit}</span>
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
