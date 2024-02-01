export interface Metrics {
    requests: Array<{ total: number, day: number }>;
    dau: number;
    wau: number;
    total: number;
}
