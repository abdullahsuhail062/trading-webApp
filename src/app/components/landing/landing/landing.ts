// landing.component.ts
import {
  Component, OnInit, OnDestroy,
  AfterViewInit, inject, ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js'; 
import { GoldPriceService } from '../../../services/gold-price.service';
import { getChartConfig } from '../chart.config';
import {
  FEATURES, MARKETS, DATASETS,
  TIMEFRAMES
} from '../landing.data';

Chart.register(...registerables);

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.html',
  changeDetection: ChangeDetectionStrategy.OnPush  // ✅ performance boost
})
export class LandingComponent implements OnInit, OnDestroy, AfterViewInit {
  private router = inject(Router);
  private goldPrice = inject(GoldPriceService);
  private chart: Chart | null = null;
  private clockInterval: any;

  // ✅ from service — reactive signals
  readonly price = this.goldPrice.formattedPrice;
  readonly isUp = this.goldPrice.isUp;
  readonly priceChange = this.goldPrice.priceChange;

  // ✅ from data file — no logic in component
  readonly features = FEATURES;
  readonly markets = MARKETS;
  readonly timeframes = TIMEFRAMES;

  currentTime = '';
  activeTimeframe = '1W';
  mobileMenuOpen = false;

  ngOnInit() {
    this.updateClock();
    this.clockInterval = setInterval(() => this.updateClock(), 1000);
    this.goldPrice.start();
  }

  ngAfterViewInit() {
    setTimeout(() => this.buildChart('1W'), 100);
  }

  ngOnDestroy() {
    clearInterval(this.clockInterval);
    this.goldPrice.stop();
    this.chart?.destroy();
  }

  updateClock() {
    this.currentTime = new Date().toUTCString().replace('GMT', 'UTC');
  }

  setTimeframe(tf: string) {
    this.activeTimeframe = tf;
    this.buildChart(tf);
  }

  buildChart(tf: string) {
    const canvas = document.getElementById('goldChart') as HTMLCanvasElement;
    if (!canvas) return;
    this.chart?.destroy();
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createLinearGradient(0, 0, 0, 220);
    grad.addColorStop(0, 'rgba(201,168,76,0.25)');
    grad.addColorStop(1, 'rgba(201,168,76,0)');
    const { labels, data } = DATASETS[tf];
    this.chart = new Chart(ctx, getChartConfig(labels, data, grad));
  }

  navigateToAuth() {
    this.router.navigate(['/auth']);
  }
}