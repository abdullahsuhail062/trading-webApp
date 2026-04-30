// src/app/landing/chart.config.ts
import { Chart, registerables, ChartConfiguration } from 'chart.js';

// ✅ register once here — not in component
Chart.register(...registerables);

export const getChartConfig = (
  labels: string[],
  data: number[],
  grad: CanvasGradient
): ChartConfiguration => ({
  type: 'line',
  data: {
    labels,
    datasets: [{
      label: 'XAU/USD',
      data,
      borderColor: '#C9A84C',
      borderWidth: 1.5,
      backgroundColor: grad,
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointHoverBackgroundColor: '#C9A84C'
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 300 },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1A1A14',
        titleColor: '#8A8470',
        bodyColor: '#C9A84C',
        borderColor: 'rgba(201,168,76,0.3)',
        borderWidth: 0.5,
        callbacks: {
          label: (ctx: any) => '$' + ctx.raw.toLocaleString('en-US', { minimumFractionDigits: 2 })
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(201,168,76,0.05)' },
        ticks: { color: '#8A8470', font: { size: 9 } }
      },
      y: {
        position: 'right',
        grid: { color: 'rgba(201,168,76,0.05)' },
        ticks: {
          color: '#8A8470',
          font: { size: 9 },
          callback: (v: any) => '$' + v.toLocaleString()
        }
      }
    }
  }
});