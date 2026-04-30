import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  imports: [BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  public lineChartType: ChartType = 'line';

  // 2. Define your Data
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Monthly Sales',
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        fill: 'origin', // Fills the area under the line
      }
    ],
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July']
  };

  // 3. Define Options (Styling & Interaction)
  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows the chart to fill its container height
    plugins: {
      legend: { display: true },
    }
  };
}
