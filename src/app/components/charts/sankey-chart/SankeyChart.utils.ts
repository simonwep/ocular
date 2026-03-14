import { SankeyChartConfig, SankeyChartType, SankeyChartLink } from './SankeyChart.types.ts';

export type TransformedSankeyChartLabel = {
  id: string;
  name: string;
  color: string;
  muted?: boolean;
  align?: 'left' | 'right';
};

export type TransformedSankeyChart = {
  labels: TransformedSankeyChartLabel[];
  links: SankeyChartLink[];
};

const absoluteSankeyChart = (config: SankeyChartConfig): TransformedSankeyChart => ({
  links: config.links,
  labels: config.labels.map((label) => {
    let sources = config.links.filter((link) => link.target === label.id);

    // First level of sankey chart
    if (!sources.length) {
      sources = config.links.filter((link) => link.source === label.id);
    }

    const value = sources.reduce((acc, link) => link.value + acc, 0);
    const name = label.formatter(value, 'absolute');

    return {
      id: label.id,
      align: label.align,
      color: label.color,
      muted: label.muted,
      value,
      name
    };
  })
});

const relativeSankeyChart = (config: SankeyChartConfig): TransformedSankeyChart => {
  const linkSums = new Map<string, number>();
  const labels: TransformedSankeyChartLabel[] = [];
  let links = config.links.filter((v) => !config.links.some((link) => link.target === v.source));
  let source: 'target' | 'source' = 'source';

  for (;;) {
    // Calculate the target value for each link
    for (const link of links) {
      linkSums.set(link[source], (linkSums.get(link[source]) ?? 0) + link.value);
    }

    // Calculate total for current level
    const levelTotal = links.reduce((acc, link) => link.value + acc, 0);

    // Create labels
    labels.push(
      ...config.labels
        .filter((v) => links.some((link) => link[source] === v.id))
        .map((v) => ({
          id: v.id,
          align: v.align,
          color: v.color,
          muted: v.muted,
          value: (linkSums.get(v.id) ?? 0) / levelTotal,
          name: v.formatter((linkSums.get(v.id) ?? 0) / levelTotal, 'percentage')
        }))
    );

    if (source === 'target') {
      break;
    }

    const nextLinks = config.links.filter((v) => links.some((link) => link.target === v.source));
    if (!nextLinks.length) {
      source = 'target'; // End is reached
    } else {
      links = nextLinks;
    }
  }

  return {
    labels,
    links: config.links
  };
};

export const transformSankeyChart = (config: SankeyChartConfig, type: SankeyChartType): TransformedSankeyChart =>
  type === 'absolute' ? absoluteSankeyChart(config) : relativeSankeyChart(config);
