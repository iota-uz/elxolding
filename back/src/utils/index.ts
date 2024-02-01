
import util from 'util';

export function stripNonNumeric(text: string): string {
    const digits = text.match(/\d+/g)?.join('');
    if (!digits)
        throw new Error('No digits found');
    return digits;
}

export function escapeRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function randomChoice<T>(choices: T[]): T {
    const index = Math.floor(Math.random() * choices.length);
    return choices[index];
}
function findAndReplace(str: string, find: string[], replace: string[]) {
    for (let i = 0; i < find.length; i ++) {
        str = str.replace(new RegExp(escapeRegExp(find[i]), 'gi'), replace[i]);
    }
    return str;
}

function evaluateExpression(value: any, expr: string): string {
    const accessors = expr.split('.').slice(1,);
    return accessors.reduce((result, accessor) => result[accessor], value);
}

export function validateTemplate(template: string, pattern: RegExp, whitelist: string[]): string | null {
    const matches = template.match(pattern);
    if (!matches) {
        return null;
    }
    for (const match of matches) {
        if (!whitelist.includes(match)) {
            return match;
        }
    }
    return null;
}

export function replacePattern(template: string, pattern: RegExp, value: any): string {
    const matches = template.match(pattern);
    if (!matches) {
        return template;
    }
    const values = matches.map((match: string) => evaluateExpression(value, match));
    return findAndReplace(template, matches, values);
}

export const sleep = util.promisify(setTimeout);

export function isProd(): boolean {
    return ['production', 'rinat'].includes(process.env.NODE_ENV as string);
}

