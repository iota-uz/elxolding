export function debounce(this: any, func: () => any, timeout: number = 500) {
    let timer: any;
    return (...args: any) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}

export interface Option {
    id: string;
    label: string;
}

export async function optionsList(service: any, labelField: string): Promise<Option[]> {
    const options: Option[] = [];
    const baseQ = {$limit: 1000, $select: ['id', labelField]};
    const response = await service.find(baseQ).exec();
    if (response.total > response.limit) {
        for (let i = 0; i < response.total / response.limit; i++) {
            const items = await service.find({$skip: i * response.limit, ...baseQ}).list().exec();
            response.data.concat(items);
        }
    }
    response.data.forEach((item: any) => {
        options.push({id: item.id, label: item[labelField]});
    });
    return options;
}
