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

export const transformSankeyChart = (config: SankeyChartConfig, type: SankeyChartType): TransformedSankeyChart => {
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
          name:
            type === 'percentage'
              ? v.formatter((linkSums.get(v.id) ?? 0) / levelTotal, type)
              : v.formatter(linkSums.get(v.id) ?? 0, type)
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
