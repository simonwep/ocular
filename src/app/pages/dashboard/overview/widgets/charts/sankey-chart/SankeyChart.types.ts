export interface SankeyChartLink {
  source: string;
  target: string;
  value: number;
  muted?: boolean;
}

export interface SankeyChartLabel {
  id: string;
  name: string;
  color: string;
  muted?: boolean;
  align?: 'left' | 'right';
}

export interface SankeyChartConfig {
  labels: SankeyChartLabel[];
  links: SankeyChartLink[];
}
