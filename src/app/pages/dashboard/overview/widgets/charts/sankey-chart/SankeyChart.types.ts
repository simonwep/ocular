export type SankeyChartLink = {
  id: string;
  source: string;
  target: string;
  value: number;
  muted?: boolean;
};

export type SankeyChartType = 'absolute' | 'percentage';

export type SankeyChartLabel = {
  id: string;
  formatter: (v: number, type: SankeyChartType) => string;
  color: string;
  muted?: boolean;
  align?: 'left' | 'right';
};

export type SankeyChartConfig = {
  labels: SankeyChartLabel[];
  links: SankeyChartLink[];
};
