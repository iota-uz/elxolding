export type ODataService = {
    name: string;
    url: string;
}

export type ODataServiceResponse<T> = {
    'odata.metadata': string;
    value: T[];
}
