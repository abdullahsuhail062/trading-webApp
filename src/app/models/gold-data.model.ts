// models/gold-data.model.ts
export interface GoldAnalysis {
  centralBankDemand: 'increasing' | 'decreasing' | 'neutral';
  realYieldDirection: 'rising' | 'falling' | 'stable';
  realYieldValue: number;
  rsiValue: number;
  rsiSignal: 'overbought' | 'oversold' | 'neutral';
  overallSentiment: 'bullish' | 'bearish' | 'neutral';
  confidenceLevel: number; // 0 to 100
  timeHorizon: string;
  keyRisks: string[];
  lastUpdated: Date;
}