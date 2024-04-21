export interface StackedLineChartSeries {
  name: string;
  data: number[];
  color?: string;
}

export interface LineChartConfig {
  series: StackedLineChartSeries[];
  labels: string[];
  valueFormatter?: (value: number) => string;
}
