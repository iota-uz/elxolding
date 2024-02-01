export interface Schema {
    patterns?: { re: RegExp, msg?: string, inverse?: boolean }[]
    required?: boolean;
    defaultMsg: string
}

export function useValidate(data: Record<string, any>, schema: Record<string, Schema>) {
    const errors: Record<string, string> = {};
    for (const [key, field] of Object.entries(schema)) {
        if (field.required && !data[key]) {
            errors[key] = field.defaultMsg;
            return {valid: false, errors};
        }

        if (!field.patterns || !field.patterns.length) {
            continue;
        }

        for (const pattern of field.patterns) {
            pattern.re.lastIndex = 0;
            const match = pattern.re.test(data[key]);
            if (match && pattern.inverse || !match && !pattern.inverse) {
                errors[key] = pattern.msg || field.defaultMsg;
                return {valid: false, errors};
            }
        }
    }
    return {valid: true, errors};
}