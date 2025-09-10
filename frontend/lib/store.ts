import { create } from 'zustand';

type Product = { id: string; name: string; price: number };

type Survey = { sentiment: 'positive' | 'neutral' | 'negative' };

type POSState = {
  partnerName: string;
  products: Product[];
  setPartnerName: (n: string) => void;
  addProduct: (p: Product) => void;
  removeProduct: (id: string) => void;
  addSurvey: (s: Survey) => void;
  exportWeeklyCsv: () => void;
  generateWeeklyReport: () => void;
};

const LS_KEY = 'watercoin_pos_state_v1';

function load(): Partial<POSState> | null {
  try {
    const s = localStorage.getItem(LS_KEY);
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

function save(state: Partial<POSState>) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch { /* noop */ }
}

export const usePOSStore = create<POSState>((set, get) => ({
  partnerName: 'Watercoin Makmur',
  products: [
    { id: 'air-ro', name: 'AIR RO 19L', price: 6000 },
    { id: 'aqua', name: 'GALON 19L AQUA', price: 20000 },
    { id: 'cleo', name: 'GALON 19L CLEO', price: 18000 },
    { id: 'galon-first', name: 'GALON PERTAMA', price: 65000 }
  ],
  setPartnerName: (n) => set((s) => { const nx = { ...s, partnerName: n }; save(nx); return nx as POSState; }),
  addProduct: (p) => set((s) => { const nx = { ...s, products: [...s.products, p] }; save(nx); return nx as POSState; }),
  removeProduct: (id) => set((s) => { const nx = { ...s, products: s.products.filter(p => p.id !== id) }; save(nx); return nx as POSState; }),
  addSurvey: (_s) => { /* stub; wire to backend later */ },
  exportWeeklyCsv: () => {
    const rows = [['Tanggal', 'Item', 'Qty', 'Liter', 'Pendapatan (Rp)'], ['2025-01-01', 'AIR RO 19L', '12', '228', '72,000']];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'weekly-report.csv'; a.click();
    URL.revokeObjectURL(url);
  },
  generateWeeklyReport: () => {
    const root = document.getElementById('chart-root');
    if (root) {
      root.innerHTML = '<div style="height:240px;display:flex;align-items:center;justify-content:center;border:1px dashed #0D6CA3;border-radius:12px">Weekly chart (stub)</div>';
    }
  }
}));


