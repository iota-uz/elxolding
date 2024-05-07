import type {Ref, UnwrapRef} from 'vue';

import type {Query} from '~/types/generics';
import {parseJwt} from '~/utils/login';

export function useLoggedIn(): boolean {
    try {
        useToken();
        return true;
    } catch (e) {
        return false;
    }
}

export function useToken(): string {
    const token: string | null | undefined = localStorage.getItem('token');
    if (!token)
        throw new Error('Not authenticated');
    const {exp} = parseJwt(token);
    if (exp < Date.now() / 1000) {
        throw new Error('Not authenticated');
    }
    return token;
}

function subQueryToString(query: any, baseKey: string): string {
    if (typeof query !== 'object' || query === null) {
        return `${baseKey}=${query}`;
    }
    const q: string[] = [];
    Object.entries(query).forEach(([key, value]: [string, any]) => {
        switch (key) {
            case '$nin':
            case '$in':
                value.forEach((v: any) => {
                    q.push(`${baseKey}[${key}][]=${v}`);
                });
                break;
            default:
                if (typeof value === 'object') {
                    q.push(subQueryToString(value, `${baseKey}[${key}]`));
                } else {
                    q.push(`${baseKey}[${key}]=${value}`);
                }
        }
    });
    return q.join('&');
}

export function queryToString<T = any>(query: Query<T>): string {
    const q: string[] = [];
    Object.entries(query || {}).forEach(([key, value]: [string, any]) => {
        switch (key) {
            case '$skip':
            case '$limit':
                q.push(`${key}=${value}`);
                break;
            case '$sort':
                Object.entries(value).forEach(([k, v]: [string, any]) => {
                    q.push(`$sort[${k}]=${v}`);
                });
                break;
            case '$or':
            case '$and':
                value.forEach((v: Record<string, any>, i: number) => {
                    q.push(subQueryToString(v, `${key}[${i}]`));
                });
                break;
            case '$select':
                value.forEach((v: any) => {
                    q.push(`$select[]=${v}`);
                });
                break;
            default:
                q.push(subQueryToString(value, key));
        }
    });
    return q.join('&');
}


export interface Service {
    get: <T, V>(query?: Query<V>) => Promise<T>;
    post: <T>(data: any) => Promise<T>;
    patch: <T>(id: string, data: any) => Promise<T>;
    delete: <T>(id: string) => Promise<T>;
}

export interface ServiceResponse<T> {
    _promise: Promise<any>;
    ref: () => ServiceResponse<Ref<UnwrapRef<T>>>;
    list: () => ServiceResponse<T>;
    exec: () => Promise<T>;
}

function serviceResponse<T extends object>(promise: Promise<T>): ServiceResponse<T> {
    return {
        _promise: promise,
        ref() {
            return serviceResponse(this._promise.then(r => ref<T>(r)));
        },
        list() {
            return serviceResponse(this._promise.then((r) => {
                if ('data' in r) {
                    return r.data as T;
                }
                return Promise.reject(new Error('Response is not paginated'));
            }));
        },
        async exec() {
            try {
                return await this._promise;
            } catch (e: any) {
                if (e.data) {
                    return Promise.reject(e.data);
                }
                return Promise.reject(createError({
                    fatal: true,
                    statusMessage: e.message,
                    message: 'Network error',
                    data: e.data
                }));
            }
        }
    };
}

export const useService = (service: string, meta?: { auth?: boolean }) => {
    const headers: Record<string, string> = (meta || {}).auth ? {'Authorization': useToken()} : {};
    const _url = useApiUrl() + (service[0] === '/' ? service : '/' + service);
    return {
        get<T extends object = any>(id: number | string): ServiceResponse<T> {
            const fullUrl = _url + `/${id}`;
            return serviceResponse($fetch<T>(fullUrl, {method: 'GET', headers}));
        },
        find<T extends object = any, V = any>(query?: Query<V>): ServiceResponse<T> {
            let fullUrl = _url;
            if (query) {
                fullUrl += '?' + encodeURI(queryToString(query));
            }
            return serviceResponse($fetch<T>(fullUrl, {method: 'GET', headers}));
        },
        create<T extends object = any>(data: any): ServiceResponse<T> {
            return serviceResponse($fetch<T>(_url, {method: 'POST', body: data, headers}));
        },
        patch<T extends object = any>(id: string | number, data: any): ServiceResponse<T> {
            return serviceResponse($fetch<T>(
                _url + `/${id}`,
                {method: 'PATCH', body: data, headers}
            ));
        },
        remove<T extends object = any>(id: string | number): ServiceResponse<T> {
            return serviceResponse($fetch<T>(
                _url + `/${id}`,
                {method: 'DELETE', headers})
            );
        }
    };
};
