export function stringToMask(val: string): Array<string | RegExp> {
    // '+### (##) ###-##-##'
    const res = [];
    for (let i = 0; i < val.length; i++) {
        const char = val.charAt(i);
        switch (char) {
            case '#':
                res.push(/\d/);
                break;
            default:
                res.push(char);
        }
    }
    return res;
}

export function translit(word: string) {
    word = word.split(' ').slice(0, 5).join(' ');

    const converter: Record<string, string> = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
        'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i',
        'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
        'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
        'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch',
        'ш': 'sh', 'щ': 'sch', 'ь': '', 'ы': 'y', 'ъ': '',
        'э': 'e', 'ю': 'yu', 'я': 'ya'
    };

    word = word.toLowerCase();

    let answer = '';
    for (let i = 0; i < word.length; ++i) {
        if (converter[word[i]] == undefined) {
            answer += word[i];
        } else {
            answer += converter[word[i]];
        }
    }

    answer = answer.replace(/[^-0-9a-z]/g, '-');
    answer = answer.replace(/[-]+/g, '-');
    answer = answer.replace(/^-|-$/g, '');

    return answer;
}

export function russianDecline(n: number, w1: string, w2: string, w3: string): string {
    if (n % 10 === 1 && n % 100 !== 11) {
        return w1;
    }
    if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) {
        return w2;
    }
    return w3;
}

export function formatMoney(value: number, decimals: number | null, options: any) {
    const digitsRE = /(\d{3})(?=\d)/g;
    options = options || {};
    if (!isFinite(value) || (!value && value !== 0)) return '';
    let symbol = useText('currency.symbol');
    decimals = decimals != null ? decimals : 2;
    const thousandsSeparator = options.thousandsSeparator != null ? options.thousandsSeparator : ',';
    const symbolOnLeft = options.symbolOnLeft != null ? options.symbolOnLeft : true;
    const spaceBetweenAmountAndSymbol = options.spaceBetweenAmountAndSymbol != null ? options.spaceBetweenAmountAndSymbol : false;
    let stringified = Math.abs(value).toFixed(decimals);
    stringified = options.decimalSeparator ?
        stringified.replace('.', options.decimalSeparator) :
        stringified;
    const _int = decimals ?
        stringified.slice(0, -1 - decimals) :
        stringified;
    const i = _int.length % 3;
    const head = i > 0 ?
        (_int.slice(0, i) + (_int.length > 3 ? thousandsSeparator : '')) :
        '';
    const _float = decimals ?
        stringified.slice(-1 - decimals) :
        '';
    symbol = spaceBetweenAmountAndSymbol ?
        (symbolOnLeft ? symbol + ' ' : ' ' + symbol) :
        symbol;
    symbol = symbolOnLeft ?
        symbol + head +
        _int.slice(i).replace(digitsRE, '$1' + thousandsSeparator) + _float :
        head +
        _int.slice(i).replace(digitsRE, '$1' + thousandsSeparator) + _float + symbol;
    const sign = value < 0 ? '-' : '';
    return sign + symbol;
}
