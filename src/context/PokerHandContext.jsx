import { createContext, useContext, useState } from 'react';
import { dealHand } from '../utils/pokerHand';

const PokerHandContext = createContext(null);

export function PokerHandProvider({ children }) {
  // useState with an initializer runs exactly once — no re-deal on re-render
  const [hand] = useState(() => dealHand());

  return (
    <PokerHandContext.Provider value={hand}>
      {children}
    </PokerHandContext.Provider>
  );
}

export function usePokerHand() {
  return useContext(PokerHandContext);
}
