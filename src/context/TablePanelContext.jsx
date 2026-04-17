import { createContext, useContext, useState } from 'react';

const TablePanelCtx = createContext({ open: false, setOpen: () => {} });

export function TablePanelProvider({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <TablePanelCtx.Provider value={{ open, setOpen }}>
      {children}
    </TablePanelCtx.Provider>
  );
}

export function useTablePanel() {
  return useContext(TablePanelCtx);
}
