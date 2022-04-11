export interface SankeyChartLink {
  source: string;
  target: string;
  value: number;
}

export interface SankeyChartLabel {
  id: string;
  name: string;
  color: string;
  align?: 'left' | 'right';
}

export interface SankeyChartConfig {
  labels: SankeyChartLabel[];
  links: SankeyChartLink[];
}
