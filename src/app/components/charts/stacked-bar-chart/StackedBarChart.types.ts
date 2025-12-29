export type StackedBarChartType = 'absolute' | 'percentage';

export type StackedBarChartBlock = {
  id: string;
  value: number;
  label: string;
  color: string;
  muted: boolean;
  formatter: (v: number, type: StackedBarChartType) => string;
};

export type StackedBarChartItem = {
  label: string;
  blocks: StackedBarChartBlock[];
};

export type StackedBarChartConfig = {
  bars: StackedBarChartItem[];
};
