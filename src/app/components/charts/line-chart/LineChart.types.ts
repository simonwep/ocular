export interface LineChartSerie {
    name: string;
    color?: string;
    data: number[];
}

export interface LineChartConfig {
    legend: string[];
    series: LineChartSerie[];
}
