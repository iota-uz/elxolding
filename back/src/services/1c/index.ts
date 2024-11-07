import axios, {AxiosInstance} from 'axios';

import {ODataService, ODataServiceResponse} from './types';

export class Client {
    private client: AxiosInstance;

    constructor(private url: string) {
        this.client = axios.create({
            baseURL: url
        });
    }

    async getODataServices(infoBase: string): Promise<ODataServiceResponse<ODataService>> {
        const url = `${infoBase}/odata/standard.odata?$format=json`;
        const response = await this.client.get(url);
        return response.data;
    }

    async getODataResource<T>(infoBase: string, resource: string): Promise<ODataServiceResponse<T>> {
        const url = `${infoBase}/odata/standard.odata/${resource}?$format=json`;
        const response = await this.client.get(url);
        return response.data;
    }
}
