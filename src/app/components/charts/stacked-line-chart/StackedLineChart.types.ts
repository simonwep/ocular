export interface StackedLineChartSeries {
  name: string;
  trendName: string;
  data: number[];
  color?: string;
}

export interface StackedLineChartConfig {
  series: StackedLineChartSeries[];
  labels: string[];
  valueFormatter?: (value: number) => string;
}
