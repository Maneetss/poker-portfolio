const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
const RANK_VALUE = Object.fromEntries(RANKS.map((r, i) => [r, i + 2])); // 2→2 … A→14

const TAGLINES = {
  'Royal Flush':     'The rarest combination. Five domains, zero overlap.',
  'Straight Flush':  'Sequential mastery. Every skill builds on the last.',
  'Four of a Kind':  'Four internships deep. Same result every time.',
  'Full House':      'Three strong, two stronger. ML meets full-stack.',
  'Flush':           'Five cards, one suit. Consistency across the stack.',
  'Straight':        'Connected across disciplines. Data to deployment.',
  'Three of a Kind': 'Three of a kind: builds, ships, iterates.',
  'Two Pair':        'Two pairs of skills. Backend plus ML, Frontend plus Data.',
  'One Pair':        'One pair: Python and patience.',
  'High Card':       'Ace high. One strong suit beats a weak hand every time.',
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function combinations(arr, k) {
  const out = [];
  const go = (start, cur) => {
    if (cur.length === k) { out.push([...cur]); return; }
    for (let i = start; i < arr.length; i++) {
      cur.push(arr[i]);
      go(i + 1, cur);
      cur.pop();
    }
  };
  go(0, []);
  return out;
}

function evaluate5(cards) {
  const vals = cards.map(c => RANK_VALUE[c.rank]).sort((a, b) => b - a);
  const suits = cards.map(c => c.suit);
  const isFlush = suits.every(s => s === suits[0]);

  const uniq = [...new Set(vals)];
  let isStraight = false, strHigh = 0;
  if (uniq.length === 5) {
    if (vals[0] - vals[4] === 4) { isStraight = true; strHigh = vals[0]; }
    if (vals[0] === 14 && vals[1] === 5 && vals[4] === 2) { isStraight = true; strHigh = 5; }
  }

  const freq = {};
  vals.forEach(v => { freq[v] = (freq[v] || 0) + 1; });
  const counts = Object.values(freq).sort((a, b) => b - a);

  let rank, name;
  if (isFlush && isStraight && strHigh === 14) { rank = 9; name = 'Royal Flush'; }
  else if (isFlush && isStraight)              { rank = 8; name = 'Straight Flush'; }
  else if (counts[0] === 4)                    { rank = 7; name = 'Four of a Kind'; }
  else if (counts[0] === 3 && counts[1] === 2) { rank = 6; name = 'Full House'; }
  else if (isFlush)                            { rank = 5; name = 'Flush'; }
  else if (isStraight)                         { rank = 4; name = 'Straight'; }
  else if (counts[0] === 3)                    { rank = 3; name = 'Three of a Kind'; }
  else if (counts[0] === 2 && counts[1] === 2) { rank = 2; name = 'Two Pair'; }
  else if (counts[0] === 2)                    { rank = 1; name = 'One Pair'; }
  else                                         { rank = 0; name = 'High Card'; }

  const score = rank * 15 ** 5 + vals[0] * 15 ** 4 + vals[1] * 15 ** 3
              + vals[2] * 15 ** 2 + vals[3] * 15 + vals[4];

  return { rank, name, score, cards };
}

function bestHand7(sevenCards) {
  return combinations(sevenCards, 5)
    .map(evaluate5)
    .reduce((b, c) => (c.score > b.score ? c : b));
}

export function dealHand() {
  const deck = shuffle(
    SUITS.flatMap(suit => RANKS.map(rank => ({ rank, suit })))
  );

  // Both players get truly random hole cards from the top of the shuffled deck
  const holeCards   = deck.slice(0, 2);  // user
  const maneetCards = deck.slice(2, 4);  // Maneet — next 2 random cards
  const flop        = deck.slice(4, 7);
  const turn        = [deck[7]];
  const river       = [deck[8]];
  const community   = [...flop, ...turn, ...river];

  const userBest   = bestHand7([...holeCards,   ...community]);
  const maneetBest = bestHand7([...maneetCards, ...community]);

  const maneetWins = maneetBest.score > userBest.score;
  const tie        = maneetBest.score === userBest.score;

  return {
    holeCards,
    maneetCards,
    flop,
    turn,
    river,
    // User
    bestHand:  userBest.name,
    bestCards: userBest.cards,
    tagline:   TAGLINES[userBest.name],
    // Maneet
    maneetBestHand:  maneetBest.name,
    maneetBestCards: maneetBest.cards,
    maneetTagline:   TAGLINES[maneetBest.name],
    // Outcome
    maneetWins,
    tie,
  };
}
