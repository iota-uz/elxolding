import {text} from '~/constants/text';

export function useText(id: keyof typeof text | string, kwargs?: Record<string, any>): string {
    let res: any = text;
    for (const key of id.split('.')) {
        res = res[key];
    }
    if (typeof res !== 'string') {
        throw new Error(`Value of id "${id.toString()}" is not a string`);
    }

    for (const [k, v] of Object.entries(kwargs || {})) {
        res = res.replace(new RegExp(`{${k}}`), v);
    }
    return res;
}
