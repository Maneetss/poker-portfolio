import { useState, useEffect, useRef, useCallback } from 'react';
import { usePokerHand }   from '../context/PokerHandContext';
import { useTablePanel }  from '../context/TablePanelContext';
import './TablePanel.css';

/* ── Constants ──────────────────────────────────────── */
const SECTIONS     = ['hero', 'about', 'skills', 'experience', 'projects', 'contact'];
const STAGE_LABELS = ['HERO', 'PLAYER', 'HAND', 'TABLE', 'BLUFFS', 'CASH'];

const STATUS_MSGS = [
  "Cards dealt. Maneet's hand is hidden.",
  'The flop hits. Three cards between you.',
  "The turn. Maneet hasn't flinched.",
  'The river. Last card down. No one blinks.',
  "Full board. Who's got the better hand?",
  'Showdown. Maneet flips his cards.',
];

/* Chip dots: filled count per stage */
const CHIP_FILLED = [0, 2, 3, 4, 4, 5];

const CONFETTI_DIRS = [
  { x: -55, y: -75 }, { x:  0, y: -88 }, { x: 55, y: -75 },
  { x: -82, y: -30 }, { x: 82, y: -30 },
  { x: -88, y:  30 }, { x: 88, y:  30 },
  { x: -55, y:  75 }, { x:  0, y:  88 }, { x: 55, y:  75 },
  { x: -22, y: -92 }, { x: 22, y: -92 },
];
const SUIT_CHARS      = ['♠', '♥', '♦', '♣'];
const COMMUNITY_SUITS = ['♠', '♥', '♦', '♣', '♠'];
const RED_SUITS       = new Set(['♥', '♦']);

const prefersReduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isInHand = (card, bestCards) =>
  bestCards.some(bc => bc.rank === card.rank && bc.suit === card.suit);

/* ── Mini Card ──────────────────────────────────────── */
function MiniCard({
  card,
  revealed   = true,
  glowing    = false,
  dimmed     = false,
  dealDelay  = 0,
  size       = 'oval',   // 'oval' | 'result'
  lifted     = false,
  pushed     = false,
}) {
  const isRed = card && RED_SUITS.has(card.suit);
  const delay = prefersReduced ? 0 : dealDelay;
  return (
    <div
      className={[
        'tpcard',
        `tpcard--${size}`,
        glowing ? 'tpcard--glowing' : '',
        dimmed  ? 'tpcard--dimmed'  : '',
        lifted  ? 'tpcard--lifted'  : '',
        pushed  ? 'tpcard--pushed'  : '',
      ].filter(Boolean).join(' ')}
      style={{ '--deal-delay': `${delay}ms` }}
    >
      <div className={`tpcard__inner${revealed ? ' tpcard__inner--revealed' : ''}`}>
        {/* Back face — face-down design */}
        <div className="tpcard__back">
          <span className="tpcard__back-mono">M♠S</span>
        </div>
        {/* Front face — face-up design */}
        <div className={`tpcard__front${isRed ? ' tpcard__front--red' : ''}`}>
          {card && (
            <>
              <span className="tpcard__corner tpcard__corner--tl">
                <span className="tpcard__rank">{card.rank}</span>
                <span className="tpcard__rank-suit">{card.suit}</span>
              </span>
              <span className="tpcard__suit-lg" aria-hidden="true">{card.suit}</span>
              <span className="tpcard__corner tpcard__corner--br" aria-hidden="true">
                <span className="tpcard__rank">{card.rank}</span>
                <span className="tpcard__rank-suit">{card.suit}</span>
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Chip dot progress ───────────────────────────────── */
function ChipDots({ filled }) {
  const allIn = filled >= 5;
  return (
    <div className="tp-pot">
      <span className="tp-pot__label">THE POT</span>
      <div className="tp-pot__dots">
        {[0, 1, 2, 3, 4].map(i => (
          <span
            key={i}
            className={`tp-pot__dot${i < filled ? ' tp-pot__dot--filled' : ''}`}
          />
        ))}
      </div>
      {allIn && (
        <span className="tp-pot__allin" key="allin">ALL IN</span>
      )}
    </div>
  );
}

/* ── Main Panel ─────────────────────────────────────── */
export default function TablePanel() {
  const { open, setOpen } = useTablePanel();
  const hand = usePokerHand();

  const [scrollStage,   setScrollStage  ] = useState(0);
  const [holeReveal,    setHoleReveal   ] = useState([prefersReduced, prefersReduced]);
  const [maneetReveal,  setManeetReveal ] = useState([false, false]);
  const [showdownPhase, setShowdownPhase] = useState(0);
  const [confetti,      setConfetti     ] = useState(false);
  const [statusKey,     setStatusKey    ] = useState(0);
  const prevStageRef    = useRef(-1);
  const showdownStarted = useRef(false);
  const panelRef        = useRef(null);

  /* ── Scroll stage (monotonically increasing) ── */
  useEffect(() => {
    const active = new Set();
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) active.add(e.target.id);
        else active.delete(e.target.id);
      });
      let maxIdx = 0;
      SECTIONS.forEach((id, i) => { if (active.has(id)) maxIdx = Math.max(maxIdx, i); });
      setScrollStage(prev => Math.max(prev, maxIdx));
    }, { threshold: 0.25 });
    SECTIONS.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  /* ── User hole card flip (800 / 950ms) ── */
  useEffect(() => {
    if (holeReveal[0]) return;
    if (prefersReduced) { setHoleReveal([true, true]); return; }
    const t0 = setTimeout(() => setHoleReveal(m => [true,  m[1]]), 800);
    const t1 = setTimeout(() => setHoleReveal(m => [m[0], true ]), 950);
    return () => { clearTimeout(t0); clearTimeout(t1); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Showdown sequence — runs once when stage 5 is reached ── */
  useEffect(() => {
    if (scrollStage < 5 || showdownStarted.current) return;
    showdownStarted.current = true;

    if (prefersReduced) {
      setManeetReveal([true, true]);
      setShowdownPhase(4);
      setConfetti(true);
      return;
    }

    // Maneet's dramatic flip: card 1 at 0ms, card 2 at 500ms
    const t0 = setTimeout(() => setManeetReveal(m => [true,  m[1]]),    0);
    const t1 = setTimeout(() => setManeetReveal(m => [m[0],  true]),  500);
    // Hand evaluation sequence begins after both flip + 600ms pause
    const t2 = setTimeout(() => setShowdownPhase(1), 1500); // Maneet win-hand glow + lift
    const t3 = setTimeout(() => setShowdownPhase(2), 1900); // Maneet non-win dim
    const t4 = setTimeout(() => setShowdownPhase(3), 2300); // User win-hand glow
    const t5 = setTimeout(() => setShowdownPhase(4), 2700); // Winner announcement
    const t6 = setTimeout(() => setConfetti(true),   2800); // Confetti burst

    return () => [t0, t1, t2, t3, t4, t5, t6].forEach(clearTimeout);
  }, [scrollStage]);

  /* ── Status key for fade transitions ── */
  useEffect(() => {
    if (prevStageRef.current !== scrollStage) {
      prevStageRef.current = scrollStage;
      setStatusKey(k => k + 1);
    }
  }, [scrollStage]);

  /* ── ESC closes ── */
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setOpen]);

  /* ── Body scroll lock on mobile ── */
  useEffect(() => {
    if (open && window.innerWidth < 768) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  /* ── Click outside closes ── */
  const onOverlay = useCallback(
    e => { if (!panelRef.current?.contains(e.target)) setOpen(false); },
    [setOpen]
  );

  if (!hand) return null;

  const {
    holeCards, maneetCards,
    flop, turn, river,
    bestHand: userBestHand,   bestCards: userBestCards,
    maneetBestHand,            maneetBestCards,
    maneetWins, tie,
  } = hand;

  /* Community slots per stage */
  const communitySlots = [
    scrollStage >= 1 ? flop[0]  : null,
    scrollStage >= 1 ? flop[1]  : null,
    scrollStage >= 1 ? flop[2]  : null,
    scrollStage >= 2 ? turn[0]  : null,
    scrollStage >= 3 ? river[0] : null,
  ];

  /* ── Glow / dim helpers gated on showdownPhase ── */
  const maneetCardGlowing = (card) =>
    showdownPhase >= 1 &&
    maneetReveal[maneetCards.indexOf(card)] &&
    isInHand(card, maneetBestCards) &&
    (maneetWins || tie);

  const maneetCardDimmed = (card) =>
    showdownPhase >= 2 &&
    maneetReveal[maneetCards.indexOf(card)] &&
    !isInHand(card, maneetBestCards) &&
    !tie;

  const communityGlow = (card) => {
    if (!card) return false;
    if ((maneetWins || tie) && showdownPhase >= 1 && isInHand(card, maneetBestCards)) return true;
    if ((!maneetWins || tie) && showdownPhase >= 3 && isInHand(card, userBestCards)) return true;
    return false;
  };

  const communityDim = (card) =>
    showdownPhase >= 2 && card && !communityGlow(card);

  const userCardGlowing = (card) =>
    showdownPhase >= 3 &&
    isInHand(card, userBestCards) &&
    (!maneetWins || tie);

  const userCardDimmed = (card) =>
    showdownPhase >= 2 && maneetWins && !tie && !isInHand(card, userBestCards);

  /* First winning card index per player (for BEST HAND label) */
  const firstManeetWin = maneetCards.findIndex(c => isInHand(c, maneetBestCards));
  const firstUserWin   = holeCards.findIndex(c => isInHand(c, userBestCards));

  return (
    <>
      {/* ── Trigger tab ── */}
      <button
        className={`tp-trigger${open ? ' tp-trigger--open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close poker table panel' : 'Open poker table panel'}
        aria-expanded={open}
      >
        {open ? (
          <span className="tp-trigger__close">✕</span>
        ) : (
          <>
            <span className="tp-trigger__suit">♠</span>
            <span className="tp-trigger__text">T·A·B·L·E</span>
          </>
        )}
      </button>

      {/* ── Backdrop ── */}
      {open && (
        <div className="tp-overlay" onClick={onOverlay} aria-hidden="true" />
      )}

      {/* ── Panel ── */}
      <aside
        ref={panelRef}
        className={`tp-panel${open ? ' tp-panel--open' : ''}`}
        role="dialog"
        aria-label="Poker Table Panel"
        aria-modal="true"
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="tp-header">
          <div className="tp-header__title">
            <span className="tp-header__suit" aria-hidden="true">♠</span>
            <span className="tp-header__label">THE TABLE</span>
          </div>
          <button
            className="tp-header__close"
            onClick={() => setOpen(false)}
            aria-label="Close panel"
          >✕</button>
        </div>
        <p className="tp-subtitle">Scrolling deals the hand</p>

        {/* ── Felt table ── */}
        <div className="tp-table-wrap">
          {/* Decorative oval — purely visual, never clips card children */}
          <div className="tp-table-oval" aria-hidden="true" />

          {/* Card overlay — flex layout, overflow never hidden */}
          <div className="tp-table-overlay">

            {/* M·SHAH — top */}
            <div className="tp-player tp-player--maneet">
              <span className="tp-player__label">M · SHAH</span>
              <div className="tp-player__cards">
                {maneetCards.map((card, i) => (
                  <MiniCard
                    key={`m${card.rank}${card.suit}`}
                    card={card}
                    revealed={maneetReveal[i]}
                    glowing={maneetCardGlowing(card)}
                    dimmed={maneetCardDimmed(card)}
                    dealDelay={i * 120}
                    size="oval"
                  />
                ))}
              </div>
            </div>

            {/* Center — pot tracker + community cards */}
            <div className="tp-table-center">
              <ChipDots filled={CHIP_FILLED[Math.min(scrollStage, 5)]} />
              <div className="tp-community" aria-label="Community cards">
                {communitySlots.map((card, i) => (
                  <div key={i} className="tp-slot">
                    {card ? (
                      <MiniCard
                        card={card}
                        revealed
                        glowing={communityGlow(card)}
                        dimmed={communityDim(card)}
                        dealDelay={i < 3 ? i * 220 : 0}
                        size="oval"
                      />
                    ) : (
                      <div className="tp-slot__empty" aria-hidden="true">
                        <span className="tp-slot__suit">{COMMUNITY_SUITS[i]}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* YOU — bottom */}
            <div className="tp-player tp-player--you">
              <div className="tp-player__cards">
                {holeCards.map((card, i) => (
                  <MiniCard
                    key={`u${card.rank}${card.suit}`}
                    card={card}
                    revealed={holeReveal[i]}
                    glowing={userCardGlowing(card)}
                    dimmed={userCardDimmed(card)}
                    dealDelay={i * 120}
                    size="oval"
                  />
                ))}
              </div>
              <span className="tp-player__label tp-player__label--you">YOU</span>
            </div>

            {/* Confetti burst */}
            {confetti && CONFETTI_DIRS.map((d, i) => (
              <span
                key={i}
                className="tp-confetti"
                style={{ '--tx': `${d.x}px`, '--ty': `${d.y}px`, '--delay': `${i * 55}ms` }}
                aria-hidden="true"
              >
                {SUIT_CHARS[i % 4]}
              </span>
            ))}
          </div>
        </div>

        {/* ── Showdown result rows — revealed after full sequence ── */}
        {showdownPhase >= 4 && (
          <div className="tp-results">
            <div className="tp-results__divider" aria-hidden="true" />

            {/* M·SHAH row */}
            <div className={`tp-result-row${maneetWins || tie ? ' tp-result-row--winner' : ' tp-result-row--loser'}`}>
              <span className="tp-result-row__name">M · SHAH</span>
              <div className="tp-result-row__cards">
                {maneetCards.map((card, i) => (
                  <div key={i} className="tp-result-card-wrap">
                    {i === firstManeetWin && (
                      <span className="tp-best-label">BEST HAND</span>
                    )}
                    <MiniCard
                      card={card}
                      revealed
                      glowing={isInHand(card, maneetBestCards) && (maneetWins || tie)}
                      lifted={isInHand(card, maneetBestCards) && (maneetWins || tie)}
                      pushed={!isInHand(card, maneetBestCards) || (!maneetWins && !tie)}
                      size="result"
                    />
                  </div>
                ))}
              </div>
              <span className="tp-result-row__hand">{maneetBestHand}</span>
            </div>

            {/* YOU row */}
            <div className={`tp-result-row${!maneetWins && !tie ? ' tp-result-row--winner' : ' tp-result-row--loser'}`}>
              <span className="tp-result-row__name">YOU</span>
              <div className="tp-result-row__cards">
                {holeCards.map((card, i) => (
                  <div key={i} className="tp-result-card-wrap">
                    {i === firstUserWin && !maneetWins && (
                      <span className="tp-best-label">BEST HAND</span>
                    )}
                    <MiniCard
                      card={card}
                      revealed
                      glowing={isInHand(card, userBestCards) && !maneetWins}
                      lifted={isInHand(card, userBestCards) && !maneetWins}
                      pushed={maneetWins && !isInHand(card, userBestCards)}
                      size="result"
                    />
                  </div>
                ))}
              </div>
              <span className="tp-result-row__hand">{userBestHand}</span>
            </div>

            <div className="tp-results__divider" aria-hidden="true" />

            {/* Winner announcement */}
            <div className="tp-winner">
              {maneetWins ? (
                <>
                  <span className="tp-winner__name">MANEET WINS ♠</span>
                  <p className="tp-winner__tagline">The house edges out. Come back stronger.</p>
                </>
              ) : tie ? (
                <>
                  <span className="tp-winner__name">SPLIT POT ♦</span>
                  <p className="tp-winner__tagline">Dead even. That's rare — let's talk.</p>
                </>
              ) : (
                <>
                  <span className="tp-winner__name">YOU WIN ♥</span>
                  <p className="tp-winner__tagline">Beginner's luck? Or maybe you belong at this table.</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── Stage indicator (bottom) ── */}
        <div className="tp-stages-wrap">
          <div className="tp-stages-track">
            {STAGE_LABELS.map((label, i) => (
              <div
                key={label}
                className={[
                  'tp-stage-node',
                  i <= scrollStage  ? 'tp-stage-node--reached' : '',
                  i === scrollStage ? 'tp-stage-node--active'  : '',
                ].filter(Boolean).join(' ')}
              >
                <div className="tp-stage-dot-row">
                  <div className="tp-stage-dot" />
                  {i < STAGE_LABELS.length - 1 && (
                    <div className="tp-stage-connector" />
                  )}
                </div>
                <span className="tp-stage-label">{label}</span>
                {i === scrollStage && scrollStage < STAGE_LABELS.length - 1 && (
                  <span className="tp-stage-arrow" aria-hidden="true">▼</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Status line ── */}
        <p className="tp-status" key={statusKey} aria-live="polite">
          {STATUS_MSGS[Math.min(scrollStage, STATUS_MSGS.length - 1)]}
        </p>
      </aside>
    </>
  );
}
