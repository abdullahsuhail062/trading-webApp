// // services/gold-data.service.ts
// import { Injectable, signal } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { delay, tap } from 'rxjs/operators';
// import { GoldAnalysis } from '../models/gold-data.model';
// import { WritableSignal } from '@angular/core';
// import { Observable } from 'rxjs';




// @Injectable({
//   providedIn: 'root'
// })
// export class GoldDataService {
//   private analysisSignal: WritableSignal<GoldAnalysis | null> = signal(null);

//   // Mock API URL
//   // private readonly API_URL = 'https://api.your-fintech-source.com/v1/gold-analysis';

//   constructor(private http: HttpClient) {}

//   /**
//    * Returns the analysis as an observable for the UI to consume
//    */
//   getGoldAnalysis(): Observable<GoldAnalysis | null> {
//     return this.analysisSignal
//   }

//   /**
//    * Fetches fresh market data. 
//    * In a real app, this would call your Node.js/Python backend.
//    */
//   fetchLatestAnalysis(): void {
//     // Simulating an API call with Mock Data
//     const mockData: GoldAnalysis = {
//       centralBankDemand: 'increasing',
//       realYieldDirection: 'rising',
//       realYieldValue: 1.58,
//       rsiValue: 47.3,
//       rsiSignal: 'neutral',
//       overallSentiment: 'neutral',
//       confidenceLevel: 65,
//       timeHorizon: 'May 2026 (30 Days)',
//       keyRisks: [
//         'Hawkish Fed leadership transition',
//         'De-escalation in Middle East geopolitics',
//         'Surge in secondary scrap supply'
//       ],
//       lastUpdated: new Date()
//     };

//     // Simulate network delay for professional "Loading" feel
//     of(mockData).pipe(
//       delay(1000), 
//       tap(data => this.analysisSignal.set(data)
//     ).subscribe();
//   }
// }