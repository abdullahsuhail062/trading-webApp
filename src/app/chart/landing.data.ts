// src/app/chart/landing.data.ts
export const FEATURES = [
  { icon: '◈', title: 'Real-time pricing', desc: 'Live spot prices with millisecond updates from major global exchanges.' },
  { icon: '▦', title: 'Advanced charting', desc: 'Professional candlestick charts, 50+ indicators, and drawing tools.' },
  { icon: '⟳', title: 'Instant execution', desc: 'Sub-millisecond order execution with guaranteed fill prices.' },
  { icon: '◎', title: 'Portfolio tracking', desc: 'Monitor your positions, P&L, and exposure across all precious metals.' },
  { icon: '⊕', title: 'Market alerts', desc: 'Set custom price alerts via SMS, email, or push notification.' },
  { icon: '◐', title: 'Secure storage', desc: 'Bank-grade encryption, 2FA, and cold storage options.' }
];

export const MARKETS = [
  { name: 'XAG/USD', price: '$27.84',     change: '+0.88%', up: true  },
  { name: 'XAU/EUR', price: '€2,156.20',  change: '+1.10%', up: true  },
  { name: 'XAU/GBP', price: '£1,841.60',  change: '-0.32%', up: false },
  { name: 'XPT/USD', price: '$918.50',    change: '-0.55%', up: false },
  { name: 'XPD/USD', price: '$1,024.30',  change: '+2.14%', up: true  },
  { name: 'BTC/USD', price: '$67,420',    change: '+3.21%', up: true  },
];

export const DATASETS: Record<string, { labels: string[]; data: number[] }> = {
  '1D': { labels: ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00'], data: [2309,2318,2312,2325,2330,2319,2335,2338] },
  '1W': { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],                       data: [2290,2305,2298,2315,2328,2322,2338] },
  '1M': { labels: ['Apr 1','Apr 5','Apr 10','Apr 15','Apr 20','Apr 25','Apr 28'],    data: [2240,2258,2271,2295,2310,2325,2338] },
  '1Y': { labels: ['May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr'], data: [1980,2010,2050,2090,2120,2060,2100,2150,2200,2260,2310,2338] }
};

export const TIMEFRAMES = ['1D', '1W', '1M', '1Y'];
export const BASE_PRICE = 2309.80;
export const INITIAL_PRICE = 2338.40;