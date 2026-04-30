// src/app/services/gold-price.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { BASE_PRICE, INITIAL_PRICE } from '../chart/landing.data';

@Injectable({ providedIn: 'root' })
export class GoldPriceService {
  private _price = signal(INITIAL_PRICE);
  private _interval: any;

  readonly price = this._price.asReadonly();

  readonly isUp = computed(() => this._price() >= BASE_PRICE);

  readonly formattedPrice = computed(() =>
    '$' + this._price().toFixed(2)
  );

  readonly priceChange = computed(() => {
    const change = ((this._price() - BASE_PRICE) / BASE_PRICE * 100);
    const up = change >= 0;
    return (up ? '+' : '') + change.toFixed(2) + '% ' + (up ? '▲' : '▼');
  });

  start() {
    this._interval = setInterval(() => {
      this._price.update(p => {
        const next = p + (Math.random() - 0.48) * 0.8;
        return Math.round(next * 100) / 100;
      });
    }, 2000);
  }

  stop() {
    clearInterval(this._interval);
  }
}